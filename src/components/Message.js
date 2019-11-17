import React, {useContext} from "react";
import { UserContext } from '../containers/App/App';

const bunqColors = ['#6f42c1', '#007bff', '#28a745', '#dc3545', '#FFC107'];

export default function Message(props) {
    let  { user, allUsers } = useContext(UserContext);
    let msg = props.msg;

    let userName = allUsers.find(u => u.id === msg.senderId).name;
    let isOwner = msg.senderId === user.id;
    let userColor = bunqColors[msg.senderId-1] ? bunqColors[msg.senderId-1] : 'black';

    return isOwner ? 
            <div className="message-wrap">
              <span className="message message--sender" key={msg.id}>
                {msg.message}
              </span>
            </div>
              :
            <div className="message-wrap">
              <span className="message__avatar" style={{ 'backgroundColor' : userColor }}>{ userName[0] }</span> 
              <span className="message" key={msg.id}>
                {msg.message}
              </span>
            </div>
}


