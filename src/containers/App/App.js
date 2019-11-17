import React, { useContext, useState } from "react";
import Chat from '../Chat/Chat';
import Login from '../Login/Login';

export const UserContext = React.createContext();

export default function App () {
    let [ user, setUser ] = useState(null);
    let [ allUsers, setAllUsers ] = useState([]);
    
    return (
      <UserContext.Provider value={{user, setUser, allUsers, setAllUsers}}>
          <div class="banner"></div>
            { user? <Chat/> : <Login/> }
      </UserContext.Provider>
    );
}
