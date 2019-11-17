import React, {useContext} from "react";
import { UserContext } from '../containers/App';
import { BUNQ_COLORS } from "../const";

export default function Avatar(props) {
    let { allUsers } = useContext(UserContext);
    let userId = props.userId;

    let userName = allUsers.find(u => u.id === userId).name;
    let userColor = BUNQ_COLORS[userId-1] ? BUNQ_COLORS[userId-1] : 'black';

    return (<span className="avatar" style={{ 'backgroundColor' : userColor }}>{ userName[0] }</span>);
}


