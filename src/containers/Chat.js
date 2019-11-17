import React, { useState, useContext, useEffect, useRef } from "react";
import Message from "../components/Message";
import { jumpToBottom } from "../utils";

import { UserContext } from './App';
import { API_ENDPOINT, CONVERSATION_ID } from "../const";

function Chat() {
    const [ messages, setMessages ] = useState([]);
    const lastMessageId = useRef();
    const [ messageValue, setMessageValue ] = useState('');
    const [ lmi, setLMI ] = useState('');

    const { user } = useContext(UserContext);

    // fetchInitialMessages();
    
    useEffect( () => {
      fetchInitialMessages()
      let pollingMessages = setInterval(() => {
        // console.log('returning lmi, ', lmi);
        // console.log('getting messages w lmi, ', lastMessageId);
        getNewMessages();
      }, 3000);
      return () => clearInterval(pollingMessages);
    }, [])

    function getNewMessages() {
      console.log('lmi, ', lastMessageId.current);
      console.log(messages.length); 
      fetch(`${API_ENDPOINT}/conversation/${CONVERSATION_ID}/new/${lastMessageId.current}`)
        .then(res => res.json())
        .then(res => { 
         
            if (res.length > 0) {
              setMessages(m => [...m, ...res]);
              console.log('setting new messages');
              lastMessageId.current = res[res.length-1].id;
              jumpToBottom();
            }
          })
          .catch(() => {
            console.error("UNABLE TO GET NEW MESSAGES");
          });
    }

    function fetchInitialMessages() {
      fetch(`${API_ENDPOINT}/conversation/${CONVERSATION_ID}/message/limited?limit=99&offset=0`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
            let sortedMessages = data.sort((a, b) => a.id - b.id );
            lastMessageId.current = sortedMessages[sortedMessages.length - 1].id;
            setMessages(sortedMessages);
            jumpToBottom();
        }
      });
    }
  
    function onSendMessage(event) {
      event.preventDefault();
      if (!messageValue) {
        return;
      }

      let newMessage = {
        'message': messageValue,
        'senderId': user.id
      };
      
      setMessageValue('');
    
      let url = `${API_ENDPOINT}/conversation/${CONVERSATION_ID}/message/send`;
      fetch(url, { 
        method: 'POST',
        body: JSON.stringify(newMessage) 
      }) 
        .then(res => res.json())
        .then(msg => {
          lastMessageId.current = msg.id;
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
            <div className="nav">
              <div>Bunq Chat</div>
            </div>
              <div className="chat">
                <form className="chat__form" onSubmit={ev => onSendMessage(ev)}>
                    <input className="chat__form__input" type="text" value={ messageValue } onChange={ev => setMessageValue(ev.target.value)} />
                  <input className="chat__form__btn"  type="submit" value="Submit" />
                </form>
              { renderMessages() }
              </div>

          </React.Fragment>
      );
}

export default Chat;