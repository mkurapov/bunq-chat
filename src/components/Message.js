import React, {useContext} from "react";
import { UserContext } from '../containers/App';
import { BUNQ_COLORS } from "../const";

export default function Message(props) {
    let  { user, allUsers } = useContext(UserContext);
    let msg = props.msg;

    let userName = allUsers.find(u => u.id === msg.senderId).name;
    let isOwner = msg.senderId === user.id;
    let userColor = BUNQ_COLORS[msg.senderId-1] ? BUNQ_COLORS[msg.senderId-1] : 'black';

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


