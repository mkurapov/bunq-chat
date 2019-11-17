import React, {Component} from "react";
import Message from "../../components/Message";
import { jumpToBottom } from "../../utils";

const endpoint = 'http://assignment.bunq.com';
const conversationId = 2232;

const bunqColors = ['#6f42c1', '#007bff', '#28a745', '#dc3545', '#FFC107'];
let userDictionary = {};


class Chat extends Component {
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
              jumpToBottom();
            }
          })
          .catch(() => {
            console.log("error");
          });
      }
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
          jumpToBottom();
        })
    }

    renderMessages() {
      if (this.state.messages && this.state.user) {
        return this.state.messages.map((msg, i) => <Message msg={msg} />);
      }
      return null;
    }

    render() {
      return (

          <React.Fragment>
            <nav>
              Dogs
            </nav>
          
              <div class="chat">
                <form class="chat__form" onSubmit={ev => this.onSendMessage(ev)}>
                    <input class="chat__form__input" type="text" value={this.state.newMessage} onChange={ev => this.onInputChange(ev)} />
                  <input class="chat__form__btn"  type="submit" value="Submit" />
                </form>
              { this.renderMessages() }
              </div>

          </React.Fragment>
      ) 
    }

}

export default Chat;