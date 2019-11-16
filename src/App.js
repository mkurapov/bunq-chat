import React, {Component} from "react";
import Login from './Login';

const endpoint = 'http://assignment.bunq.com';
const conversationId = 2232;

class App extends Component {
    constructor() {
        super();
        this.state = {
            newMessage: '',
            user: {},
            userPossibilities: [],
            isLoggedIn: false,
            messages: [],
            lastMessageId: 0,
            conversation: null
        };
    }

    componentDidMount() {

      fetch(`${endpoint}/users`)
        .then(res => res.json())
        .then(res => { console.log(res); this.setState({userPossibilities: res});  });

      fetch(`${endpoint}/conversation/${conversationId}`)
        .then(res => res.json())
        .then(res => { this.setState({conversation: res}) ;console.log(res)});

      fetch(`${endpoint}/conversation/${conversationId}/message/limited?limit=99&offset=0`)
        .then(res => res.json())
        .then(res => { this.setState({messages: res}) ;console.log(res)});

      //   setInterval(() => {
      //     this.getMessages();
      // }, 3000);
    }

    componentWillUnmount() {
      
    }

    getMessages() {
      fetch(`${endpoint}/conversation/${conversationId}/new/${this.state.lastMessageId}`)
        .then(res => res.json())
        .then(res => { this.setState({messages: res}) ;console.log(res)});
    }

    handleChange(event) {
      this.setState({newMessage: event.target.value});
    }
  
    onSendMessage(event) {
      let newMessage = {
        'message': this.state.newMessage,
        'senderId': this.state.user.id
      };

      this.setState({newMessage: ''})

      // console.log([...this.state.messages, newMessage]);

      // this.setState({  messages: [...this.state.messages, newMessage] });
      
      event.preventDefault();

      let url = `${endpoint}/conversation/${conversationId}/message/send`;
      
      fetch(url, { 
        method: 'POST',
        body: JSON.stringify(newMessage) 
      }) 
        .then(res => res.json())
        .then(msg => {
          this.setState({ lastMessageId: msg.id, messages: [...this.state.messages, {
            ...newMessage, id: msg.id
          }] });
        })
        // .then(() => this.getMessages());
    }

    renderMessages() {
      return this.state.messages.map((msg, i) => (
        <li key={msg.id}>{msg.message}</li>
      ));
    }
    
    onSelectUser(newUser) {
      console.log('selected user: ',newUser);
      
      this.setState({
        user: newUser,
        isLoggedIn: true
      });

      // localStorage.setItem('users', JSON.stringify(users));
    }
    
    renderUserSelection() {
      return this.state.userPossibilities.map((user, i) => (
        <div key={i} onClick={() => this.onSelectUser(user)}>{user.name}</div>
      ));
    }

    renderActiveUsers() {
      return this.state.users.map((user, i) => (
        <span key={i}>{user.name}  </span>
      ));
    }

    render() {

      if (this.state.isLoggedIn) {
        return (
          <div>

          <form onSubmit={ev => this.onSendMessage(ev)}>
            <label>
              Message:
              <input type="text" value={this.state.newMessage} onChange={ev => this.handleChange(ev)} />
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
          { this.renderUserSelection() }
          </div>
        );
      }
    }
}

export default App;