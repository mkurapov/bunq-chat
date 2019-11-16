import React, {Component, useContext} from "react";
import { UserContext } from '../containers/App/App'

const bunqColors = ['#6f42c1', '#007bff', '#28a745', '#dc3545', '#FFC107'];

export default function Message(props) {
    let [ userDictionary, user ] = useContext(UserContext);
    let msg = props.msg;

    let userName = userDictionary[msg.senderId];
    let isOwner = msg.senderId == user.id;
    let userColor = bunqColors[msg.senderId-1];

    return isOwner ? 
            <div class="message-wrap">
              <span class="message message--sender" key={msg.id}>
                {msg.message}
              </span>
            </div>
              :
            <div class="message-wrap">
              <span class="message__avatar" style={{ 'background-color' : userColor }}>{ userName[0] }</span> 
              <span class="message" key={msg.id}>
                {msg.message}
              </span>
            </div>
}


