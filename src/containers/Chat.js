import React, { useState, useContext, useEffect } from "react";
import Message from "../components/Message";
import { jumpToBottom } from "../utils";

import { UserContext } from './App';
import { API_ENDPOINT, CONVERSATION_ID } from "../const";
import Avatar from "../components/Avatar";

function Chat() {
    const [ messages, setMessages ] = useState([]);
    const [ messageValue, setMessageValue ] = useState('');
    const [ lastMessageId, setLastMessageId ] = useState('');

    const { user } = useContext(UserContext);
    
    useEffect( () => {
      fetchInitialMessages()
    }, [])

    //poll new messages every 3s, and update if new messages arrive
    useEffect( () => {
      let pollingMessages = setInterval(() => getNewMessages(), 3000);
      return () => clearInterval(pollingMessages);
    }, [lastMessageId])

    function getNewMessages() {
      if (lastMessageId) {
        fetch(`${API_ENDPOINT}/conversation/${CONVERSATION_ID}/new/${lastMessageId}`)
          .then(res => res.json())
          .then(res => { 
            if (res.length > 0) {
              setMessages(m => [...m, ...res]);
              setLastMessageId(res[res.length-1].id);
              jumpToBottom();
            }
          })
          .catch(() => {
            console.error("UNABLE TO GET NEW MESSAGES");
          });
      }
    }

    function fetchInitialMessages() {
      fetch(`${API_ENDPOINT}/conversation/${CONVERSATION_ID}/message/limited?limit=10&offset=0`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
            let sortedMessages = data.sort((a, b) => a.id - b.id );
            setLastMessageId(sortedMessages[sortedMessages.length - 1].id);
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
            <div className="nav">
              <div className="nav__inner">
                <div>Bunq Chat</div>
                <div className="nav__avatar">
                  <Avatar userId={user.id}></Avatar>
                </div>
              </div>
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