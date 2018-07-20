import React, { Component } from 'react';
import './app.css'

class App extends Component {
  constructor(props) {
    super();
    this.getData = this.getData.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    
    this.state = {
      session: props.session,
      input: '',
      todos: [],
      uri: `/api`,
    };
  }
  componentDidMount() {
    // this makes the initial fetch when the component mounts
    this.getData()
  }
  getData() {
    fetch(`${this.state.uri}/data/${this.state.session}/`).then((data, err) => {
      if (err) console.log(err);
      return data.json();
    }).then((data) => {
      // sets the state to the data value
      this.setState({
        todos: data,
      });
    });
  }
  deleteItem(id) {
    fetch(`${this.state.uri}/delete/${id}`)
      .then(() => this.getData())
  }
  postItem(text) {
    // text = text.replace(/\?|\:|\'|\"|\!/g, '')
    fetch(encodeURI(`${this.state.uri}/post/${text}/${this.state.session}`,)  { method: 'POST'})
      .then(() => this.getData())
      .then(() => this.input.value = '')
  }
  handleSubmit() {
    this.setState({
      input: this.input.value
    }, () => this.postItem(this.state.input))
  }
  TodoList = () => (
    <ul>
      {this.state.todos.map(e => <li key={e.id}>
        <button onClick={() => this.deleteItem(e.id)}>
         <span role="img" aria-label="check">✔️</span>
        </button>{e.todo}</li>)}
    </ul>
  )
  InputTodo = () => (
    <div>
      <input 
        type="submit" 
        onClick={() => this.handleSubmit()} 
        value="ToDo"
      />
      <input 
        type="text" 
        ref={(input) => this.input = input}
        onKeyPress={(event) => event.key === 'Enter' ? this.handleSubmit(event) : null}
      />
    </div>
  )
  render() {
    return (
      <div className="flex">
        <div className="input">
          <this.InputTodo />
        </div>
      {this.state.todos.length ? <this.TodoList /> : <ul><li>Add Something</li></ul>}
    </div> 
    );
  }
}

export default App;