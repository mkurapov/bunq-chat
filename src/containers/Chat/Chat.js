import React, { useState, useContext, useEffect } from "react";
import Message from "../../components/Message";
import { jumpToBottom } from "../../utils";

import { UserContext } from '../App/App';

const endpoint = 'http://assignment.bunq.com';
const conversationId = 2232;

const bunqColors = ['#6f42c1', '#007bff', '#28a745', '#dc3545', '#FFC107'];
let userDictionary = {};


function Chat() {
    const [ allUsers, setAllUsers ] = useState([]);
    const [ messages, setMessages ] = useState([]);
    const [ conversation, setConversation ] = useState(null);
    const [ lastMessageId, setLastMessageId ] = useState(0);
    const [ messageValue, setMessageValue ] = useState('');

    const { user } = useContext(UserContext);

    

    useEffect( () => {
      fetchInitialMessages();
    }, [])

    // function fetchConversation() {
    //   fetch(`${endpoint}/conversation/${conversationId}`)
    //     .then(res => res.json())
    //     .then(res => { setConversation(res) });
    // }

    function fetchInitialMessages() {
      fetch(`${endpoint}/conversation/${conversationId}/message/limited?limit=99&offset=0`)
        .then(res => res.json())
        .then(res => { 
          if (res.length > 0) {
            let sortedMessages = res.sort((a, b) => a.id - b.id );
            setLastMessageId(sortedMessages[sortedMessages.length - 1].id);
            console.log('lmi, ', sortedMessages[sortedMessages.length - 1].id);
            console.log('lmi, ', lastMessageId);
            setInterval(() => getMessages(), 3000);
            setMessages(sortedMessages);
            jumpToBottom();
          }
        });
    }

    function pollMessages() {
      setInterval(getMessages, 3000);
    }

    function getMessages() {
      if (lastMessageId) {
        console.log('getting messages');
        fetch(`${endpoint}/conversation/${conversationId}/new/${lastMessageId}`)
        .then(res => res.json())
        .then(res => { 
          console.log(res);
            if (res.length > 0 && res.length !== messages.length) {
              setMessages([...messages, ...res]);
              setLastMessageId(res[res.length-1].id );
              jumpToBottom();
            }
          })
          .catch(() => {
            console.log("error");
          });
      }
    }
  
    function onSendMessage(event) {
      console.log('lmi, ', lastMessageId);

      let newMessage = {
        'message': messageValue,
        'senderId': user.id
      };
      
      setMessageValue('');
      
      event.preventDefault();
    
      let url = `${endpoint}/conversation/${conversationId}/message/send`;
      fetch(url, { 
        method: 'POST',
        body: JSON.stringify(newMessage) 
      }) 
        .then(res => res.json())
        .then(msg => {
          setLastMessageId(msg.id);
          setMessages([...messages, {
            ...newMessage, id: msg.id
          }]);
          jumpToBottom();
        })
    }

    function renderMessages() {
      if (messages && user) {
        return messages.map((msg, i) => <Message key={msg.id} msg={msg} />);
      }
      return null;
    }

      return (
          <React.Fragment>
            <nav>
              Dogs
            </nav>
              <div class="chat">
                <form class="chat__form" onSubmit={ev => onSendMessage(ev)}>
                    <input class="chat__form__input" type="text" value={ messageValue } onChange={ev => setMessageValue(ev.target.value)} />
                  <input class="chat__form__btn"  type="submit" value="Submit" />
                </form>
              { renderMessages() }
              </div>

          </React.Fragment>
      );
}

export default Chat;