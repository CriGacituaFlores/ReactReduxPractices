import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const Title = ({count}) => {
  return (
    <div>
       <div>
          <h1>to-do {count}</h1>
       </div>
    </div>
  );
}

Title.propTypes = {count: PropTypes.number}

const TodoForm = ({addTodo}) => {
  // Input Tracker
  let input;
  // Return JSX
  return (
    <div>
      <input ref={node => { input = node }} />
      <button onClick={() => {
        addTodo(input.value);
        input.value = '';
      }}>
        +
      </button>
    </div>
  );
};

const Todo = ({todo, remove}) => {
  // Each Todo
  return (
    <li onClick={() => {remove(todo.id)}}>{todo.text}</li>
  )
}

const TodoList = ({todos, remove}) => {
  // Map through the todos
  const todoNode = todos.map((todo) => {
    return (<Todo todo={todo} key={todo.id} remove={remove}/>)
  });
  return (<ul>{todoNode}</ul>);
}

// Contaner Component (Ignore for now)
window.id = 0;
class TodoApp extends Component{

  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
    this.apiUrl = "https://57b1924b46b57d1100a3c3f8.mockapi.io/api/todos";
  }

  // Lifecycle method
  componentDidMount(){
    // Make HTTP reques with Axios
    axios.get(this.apiUrl)
      .then((res) => {
        // Set state with result
        this.setState({data:res.data});
      });
  }

  // Add todo handler
  addTodo(val){
    // Assemble data
    const todo = {text: val, id: window.id++}
    // Update data
    //this.state.data.push(todo);
    // Update state
    //this.setState({data: this.state.data});
    axios.post(this.apiUrl, todo)
       .then((res) => {
          this.state.data.push(res.data);
          this.setState({data: this.state.data});
       });
  }
  // Handle remove
  handleRemove(id){
    // Filter all todos except the one to be removed
    const remainder = this.state.data.filter((todo) => {
      if(todo.id !== id) return todo;
    });
    // Update state with filter
    axios.delete(this.apiUrl+'/'+id)
      .then((res) => {
        this.setState({data: remainder});      
      })
  }

  render(){
    return (
      <div>
        <Title count={this.state.data.length}/>
        <TodoForm addTodo={this.addTodo.bind(this)}/>
        <TodoList 
          todos={this.state.data}
          remove={this.handleRemove.bind(this)}  
        />
      </div>
    );
  }
}

export default TodoApp;
