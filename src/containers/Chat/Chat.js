import React, { useState, useContext, useEffect } from "react";
import Message from "../../components/Message";
import { jumpToBottom } from "../../utils";

import { UserContext } from '../App/App';
import { API_ENDPOINT } from "../../vars";

const conversationId = 2232;

function Chat() {
    const [ messages, setMessages ] = useState([]);
    // const [ conversation, setConversation ] = useState(null);
    const [ lastMessageId, setLastMessageId ] = useState(0);
    const [ messageValue, setMessageValue ] = useState('');

    const { user } = useContext(UserContext);

    useEffect( () => {
      fetchInitialMessages();
    }, [])

    function fetchInitialMessages() {
      fetch(`${API_ENDPOINT}/conversation/${conversationId}/message/limited?limit=99&offset=0`)
        .then(res => res.json())
        .then(res => { 
          if (res.length > 0) {
            let sortedMessages = res.sort((a, b) => a.id - b.id );
            setLastMessageId(sortedMessages[sortedMessages.length - 1].id);
            setInterval(() => getNewMessages(), 3000);
            setMessages(sortedMessages);
            jumpToBottom();
          }
        });
    }

    function getNewMessages() {
      if (lastMessageId) {
        fetch(`${API_ENDPOINT}/conversation/${conversationId}/new/${lastMessageId}`)
        .then(res => res.json())
        .then(res => { 
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
    
      let url = `${API_ENDPOINT}/conversation/${conversationId}/message/send`;
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