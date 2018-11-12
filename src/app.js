import React, { Component, Fragment } from 'react'
import './app.css'

class App extends Component {
  state = {
    session: this.props.session,
    input: '',
    todos: [],
    uri: `/api`
  }
  componentDidMount() {
    this.getData()
  }
  getData() {
    fetch(`${this.state.uri}/data/${this.state.session}/`)
      .then((data, err) => {
        if (err) console.log(err)
        return data.json()
      })
      .then(data => {
        // sets the state to the data value
        this.setState({
          todos: data
        })
      })
  }
  deleteItem(id) {
    fetch(`${this.state.uri}/delete/${id}`, { method: 'DELETE' }).then(() =>
      this.getData()
    )
  }
  postItem(text) {
    fetch(
      encodeURI(
        `${this.state.uri}/post/${encodeURIComponent(text)}/${
          this.state.session
        }`
      ),
      {
        method: 'POST'
      }
    )
      .then(() => this.getData())
      .then(() => (this.input.value = ''))
  }
  patchItem(id) {
    fetch(encodeURI(`${this.state.uri}/softDel/${id}/${this.state.session}`), {
      method: 'PATCH'
    }).then(() => (this.input.value = ''))
  }
  handleSubmit() {
    this.setState(
      {
        input: this.input.value
      },
      () => this.postItem(this.state.input)
    )
  }
  softDelete = id => {
    this.setState(state => {
      return {
        todos: state.todos.map(item => {
          if (item._id === id) {
            item.deleted = !item.deleted
          }
          return item
        })
      }
    })
    this.patchItem(id)
  }
  RenderList = () => {
    const sortedByDelete = this.state.todos
    sortedByDelete.sort((x, y) => y.deleted - x.deleted)
    return (
      <ul>
        {sortedByDelete.map(e => (
          <li key={e._id}>
            {e.deleted ? (
              <button
                style={{ color: 'red' }}
                onClick={() => this.deleteItem(e._id)}>
                <span role="img" aria-label="check">
                  𝗫
                </span>
              </button>
            ) : (
              <button onClick={() => this.softDelete(e._id)}>
                <span role="img" aria-label="check">
                  ✔️
                </span>
              </button>
            )}
            {e.deleted ? (
              <Fragment>
                <small style={{ textDecoration: 'line-through' }}>
                  {e.todo}
                </small>
                <button
                  style={{ marginLeft: '1rem' }}
                  onClick={() => this.softDelete(e._id)}>
                  ❗️
                </button>
              </Fragment>
            ) : (
              e.todo
            )}
          </li>
        ))}
      </ul>
    )
  }

  RenderInput = () => (
    <div>
      <input type="submit" onClick={() => this.handleSubmit()} value="ToDo" />
      <input
        type="text"
        ref={input => (this.input = input)}
        onKeyPress={event =>
          event.key === 'Enter' ? this.handleSubmit(event) : null
        }
      />
    </div>
  )
  render() {
    return (
      <div className="flex">
        <div className="input">
          <this.RenderInput />
        </div>
        {this.state.todos.length ? (
          <this.RenderList />
        ) : (
          <ul>
            <li>Add Something</li>
          </ul>
        )}
      </div>
    )
  }
}

export default App
