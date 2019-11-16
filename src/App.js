import React, {Component} from "react";
import Login from './Login';

const endpoint = 'http://assignment.bunq.com';
const conversationId = 2232;

class App extends Component {
    constructor() {
        super();
        this.state = {
            newMessage: '',
            user: null,
            userPossibilities: [],
            messages: [],
            lastMessageId: 0,
            conversation: null
        };
    }

    componentDidMount() {

      fetch(`${endpoint}/users`)
        .then(res => res.json())
        .then(res => { this.setState({userPossibilities: res}); });

      fetch(`${endpoint}/conversation/${conversationId}`)
        .then(res => res.json())
        .then(res => { this.setState({conversation: res}) });

      fetch(`${endpoint}/conversation/${conversationId}/message/limited?limit=99&offset=0`)
        .then(res => res.json())
        .then(res => { 
          if (res.length > 0) {
            let sortedMessages = res.sort((a, b) => a.id - b.id );
            this.setState({messages: sortedMessages, lastMessageId: sortedMessages[sortedMessages.length - 1].id });
          }
        });

        // this.pollMessages();
    }

    


    pollMessages() {
      setInterval(() => {
          this.getMessages();
      }, 3000);
    }

    getMessages() {
      if (this.state.lastMessageId) {
        fetch(`${endpoint}/conversation/${conversationId}/new/${this.state.lastMessageId}`)
        .then(res => res.json())
        .then(res => { 
          console.log(res);
            if (res.length > 0 && res.length !== this.state.messages.length) {
              console.log('updating messages');
              console.log(this.state.messages.length);
              this.setState({messages: [...this.state.messages, ...res], lastMessageId: res[res.length-1].id }); console.log(res);
              this.jumpToBottom();
            }
          })
          .catch(() => {
            console.log("error");
          });
      }
    }

    jumpToBottom() {
      window.scrollTo(0,document.body.scrollHeight);
    }

    onInputChange(event) {
      this.setState({newMessage: event.target.value});
    }
  
    onSendMessage(event) {
      let newMessage = {
        'message': this.state.newMessage,
        'senderId': this.state.user.id
      };

      this.setState({newMessage: ''})
      
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
          this.jumpToBottom();
        })
        // .then(() => this.getMessages());
    }

    
    onSelectUser(newUser) {
      console.log('selected user: ',newUser);
      this.setState({ user: newUser });
    }
    
    

    componentWillUnmount() {
      
    }

    renderMessages() {
      if (this.state.messages && this.state.user) {
        return this.state.messages.map((msg, i) => (
          <div class="message-wrap">
            { (msg.senderId == this.state.user.id) ? null : <span class="message__avatar">D</span> }
            <span className={'message ' + (msg.senderId == this.state.user.id ? 'message--sender' : '' )} key={msg.id}>
              {msg.message}
            </span>
          </div>
        ));
      }
      return null;
    }

    renderUserSelection() {
      return this.state.userPossibilities.map((user, i) => (
        <div key={i} onClick={() => this.onSelectUser(user)}>{user.name}</div>
      ));
    }

    render() {

      if (this.state.user) {
        return (
          <div class="chat">

          <form class="chat__form" onSubmit={ev => this.onSendMessage(ev)}>
              <input class="chat__form__input" type="text" value={this.state.newMessage} onChange={ev => this.onInputChange(ev)} />
            <input class="chat__form__btn"  type="submit" value="Submit" />
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