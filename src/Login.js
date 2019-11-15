import React, {Component} from "react";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            user: '',
            users: [],
            messages: [],
        };
    }

    componentDidMount() {
      
    }

    renderMessages() {
      return this.state.messages.map((msg, i) => (
        <li key={i}>{msg}</li>
      ));
    }

    renderUsers() {
      return this.state.users.map((user, i) => (
        <div key={i}>{user.name}</div>
      ));
    }

    render() {
      return (
        <div>
          Login
        </div>
      );
    }
}

export default Login;