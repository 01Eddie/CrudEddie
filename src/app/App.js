import React, { Component } from 'react';

class App extends Component {

  constructor() {
    super();
    this.state = {
      title: '',
      description: '',
      number: '',
      _id: '',
      tasks: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.addTask = this.addTask.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  addTask(e) {
    e.preventDefault();
    if(this.state._id) {
      fetch(`/api/tasks/${this.state._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: this.state.title,
          description: this.state.description,
          number: this.state.number
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          window.M.toast({html: 'Task Updated'});
          this.setState({_id: '', title: '', description: '', number: '' });
          this.fetchTasks();
        });
    } else {
      fetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(this.state),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          window.M.toast({html: 'Task Saved'});
          this.setState({title: '', description: '', number: ''});
          this.fetchTasks();
        })
        .catch(err => console.error(err));
    }

  }

  deleteTask(id) {
    if(confirm('Estas seguro que quieres borrar esto?')) {
      fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          M.toast({html: 'Task deleted'});
          this.fetchTasks();
        });
    }
  }

  editTask(id) {
    fetch(`/api/tasks/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({
          title: data.title,
          description: data.description,
          number: data.number,
          _id: data._id
        });
      });
  }

  componentDidMount() {
    this.fetchTasks();
  }

  fetchTasks() {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        this.setState({tasks: data});
        console.log(this.state.tasks);
      });
  }

  render() {
    return (
      <div>
        {/* NAVIGATION */}
        <nav className="light-blue darken-4">
          <div className="container">
            <div className="nav-wrapper">
              <a href="#" className="title">CRUD</a>
            </div>
          </div>
        </nav>

        <div className="container">
          <div className="row">
            <div className="col s5">
              <div className="card">
                <div className="card-content">
                <div className="row">
                  <h2 className="stitle">Agregar numero</h2></div>
                  <form onSubmit={this.addTask}>
                    <div className="row box">
                      <div className="input-field col">
                        <input name="title" onChange={this.handleChange} value={this.state.title} type="text" placeholder="Nombre" autoFocus/>
                      </div>
                    </div>
                    <div className="row box" >
                      <div className="input-field col">
                        <textarea name="description" onChange={this.handleChange} value={this.state.description} cols="30" rows="10" placeholder="e-mail" className="materialize-textarea"></textarea>
                      </div>
                    </div>
                    <div className="box">
                      <div className="input-field col">
                        <textarea name="description" onChange={this.handleChange} value={this.state.number} cols="30" rows="10" placeholder="Telefono" className="materialize-textarea"></textarea>
                      </div>
                    </div>

                    <button type="submit" className="btn light-blue darken-4">
                      Enviar 
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col s7">
              <table>
                <thead>
                  <tr>
                    <th>Numero</th>
                    <th>Email</th>
                    <th>Number</th>
                  </tr>
                </thead>
                <tbody>
                  { 
                    this.state.tasks.map(task => {
                      return (
                        <tr key={task._id}>
                          <td>{task.title}</td>
                          <td>{task.description}</td>
                          <td>{task.number}</td>
                          <td>
                            <button onClick={() => this.deleteTask(task._id)} className="btn light-blue darken-4">
                              <i className="material-icons">borrar</i> 
                            </button>
                            <button onClick={() => this.editTask(task._id)} className="btn light-blue darken-4" style={{margin: '4px'}}>
                              <i className="material-icons">editar</i>
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default App;
