import React, {Component} from "react";
import Login from './Login';

class App extends Component {
    constructor() {
        super();
        this.state = {
            value: '',
            user: {},
            users: [],
            isLoggedIn: false,
            messages: [],
        };
    }

    componentDidMount() {
      fetch("http://assignment.bunq.com/users")
        .then(res => res.json())
        .then(res => this.setState({users: res}));
      
        const currentUsers = localStorage.getItem('users');
        console.log(currentUsers);

        if (!currentUsers) {
          
        } else {
          
        }       



        const {endpoint} = this.state;
    }

    componentWillUnmount() {
      
    }

    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      this.setState(state => {
        const messages = [...state.messages, state.value];
        return {
          messages,
          value: '',
        };
      });
      event.preventDefault();
    }

    renderMessages() {
      return this.state.messages.map((msg, i) => (
        <li key={i}>{msg}</li>
      ));
    }

    onSelectUser(user) {
      this.setState({
        user: user,
        isLoggedIn: true
      });
      console.log(user);
    }

    renderUsers() {
      return this.state.users.map((user, i) => (
        <div key={i} onClick={() => this.onSelectUser(user)}>{user.name}</div>
      ));
    }

    render() {

      if (this.state.isLoggedIn) {
        return (
          <div>

          <form onSubmit={ev => this.handleSubmit(ev)}>
            <label>
              Essay:
              <input type="text" value={this.state.value} onChange={ev => this.handleChange(ev)} />
            </label>
            <input type="submit" value="Submit" />
          </form>
          
            { this.renderMessages() }
          </div>
        )
      }
      else {
        return (
          <div>
          { this.renderUsers() }
          </div>
        );
      }
    }
}

export default App;