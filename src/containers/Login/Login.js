import React, {Component} from "react";

const endpoint = 'http://assignment.bunq.com';

const bunqColors = ['#6f42c1', '#007bff', '#28a745', '#dc3545', '#FFC107'];
let userDictionary = {};

class Login extends Component {
    constructor() {
        super();
        this.state = {
            user: null,
            userPossibilities: [],
        };
    }

    componentDidMount() {
      fetch(`${endpoint}/users`)
        .then(res => res.json())
        .then(res => { 
          res.forEach(u => {
            userDictionary[u.id] = u.name;
          });
          console.log(userDictionary);
          this.setState({userPossibilities: res}); 
        });
    }

    renderUserSelection() {
      return this.state.userPossibilities.map((user, i) => (
        <div key={i} onClick={() => this.onSelectUser(user)}>{user.name}</div>
      ));
    }

    render() {
      return (

          <div>
            { this.renderUserSelection() }
          </div>
        ) 
    }

}

export default Login;