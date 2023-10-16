import '../assets/css/style.css';

const app = document.getElementById('app');
app.innerHTML = `
  
  <div class="todoss">
    <h1>To do list
    </h1>
    <button class="todos-completed" "> Completed Task
    </button><br> <br>
    <form class="todos-form" name="todos" >
      <input type="text" class="todo" placeholder="Enter your To-Do's">
    
      
    </form>
    <p>double click to edit the Todo's
    </p>
    <ul class="list-todos">

      </ul>
  </div>
`;
let sorted=[];
let todos=JSON.parse(localStorage.getItem('todos')) || [];
let sort=false;

const root = document.querySelector('.todoss');
//const sort= root.querySelector('.todos-completed')
const list = root.querySelector('.list-todos');

const form = document.forms.todos;
const input= form.querySelector('.todo');

function renderTodos(todos){
  let todoString='';

  todos.forEach((todo,index)=> {
    todoString+=`<li data-id="${index}"${todo.complete ? ' class="todos-complete"': ''}>
    <input type="checkbox"${todo.complete ? ' checked': ''}>
    <span>${todo.label} </span>
    <button type="button" class="delete">Delete</button>
    </li>
    `;
  });

  list.innerHTML=todoString;

}

function Addtodo(event){
  event.preventDefault();
  
  const label = input.value.trim();
  const complete=false;
  todos=[
    ...todos,{
      label,
      complete,
     },
  ];
  saveToStorage(todos);
  renderTodos(todos);
  input.value='';
}

function updateTodo(event){
  const id= parseInt(event.target.parentNode.getAttribute('data-id'),10);
  
  const complete = event.target.checked;
  todos=todos.map((todo, index) =>  {
    if (index===id){
      return {
        ...todo,
         complete,
      };
    }
    return todo;
  });
  saveToStorage(todos);
  renderTodos(todos);
  
}

function deleteTodo(event){
  if (event.target.className.toLowerCase()!=='delete'){
    return;
  }
  
  const id=parseInt(event.target.parentNode.getAttribute('data-id'),10);
  const label= event.target.previousElementSibling.innerText;
  
  if (window.confirm(`Delete ${label}?`)){
      todos=todos.filter((todo, index)=> index!==id);
      saveToStorage(todos);
      renderTodos(todos);
  }
}

function sortTodo(event){
  if (event.target.className.toLowerCase()!=='todos-completed'){
    return;
  }
  if (sort!==true){
    sorted=todos.filter(todo=> todo.complete);
    sort=true;
    renderTodos(sorted);
  }
  else{ 
    renderTodos(todos);
    sort=false;

  }
}

function saveToStorage(todos){
  localStorage.setItem('todos',JSON.stringify(todos));
}

function editTodo(event){
  if (event.target.nodeName.toLowerCase()!== 'span'){
    return;
  }
  const id= event.target.parentNode.getAttribute('data-id');
  const todolabel= todos[id].label;

  const input= document.createElement('input');
  input.type='text';
  input.value=todolabel;
  const save= document.createElement('button');
  save.type='submit';
  save.innerText='Save';
  save.onclick=()=>{
    handleEdit(event);
  }


  function handleEdit(event){
    event.stopPropagation();
    const label=input.value;
    if (label!==todolabel){
      todos=todos.map((todo,index)=>{
        if (index==id){
          return{
            ...todo,
            label,
          };
        }
        return todo;
      });
      
      renderTodos(todos);
      saveToStorage(todos);
    }

    // clean up
    console.log(event.target)
    event.target.style.display = '';
    input.remove();
    save.remove();
  } 


  console.log(event.target);
  event.target.style.display='none';

  event.target.parentNode.append(input,save);
  
  input.addEventListener('change', handleEdit);
  
  
  
}

function init(){

  renderTodos(todos);

  root.addEventListener('click', sortTodo)

  form.addEventListener('submit',Addtodo);

  list.addEventListener('change',updateTodo);

  list.addEventListener('click', deleteTodo)

  list.addEventListener('dblclick', editTodo);
  
}

init();