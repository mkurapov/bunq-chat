import React, {useContext} from "react";
import { UserContext } from '../containers/App';
import Avatar from "./Avatar";

export default function Message(props) {
    let  { user } = useContext(UserContext);
    let msg = props.msg;
    let isOwner = msg.senderId === user.id;

    return isOwner ? 
            <div className="message-wrap">
              <span className="message message--sender" key={msg.id}>
                {msg.message}
              </span>
            </div>
              :
            <div className="message-wrap">
              <div className="message__avatar">
                <Avatar userId={ msg.senderId }></Avatar>
              </div>
              <span className="message" key={msg.id}>
                {msg.message}
              </span>
            </div>
}


