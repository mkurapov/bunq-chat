import React, { useState } from "react";
import Chat from './Chat';
import Login from './Login';

export const UserContext = React.createContext();

export default function App () {
    let [ user, setUser ] = useState(null);
    let [ allUsers, setAllUsers ] = useState([]);
    
    return (
      <UserContext.Provider value={{user, setUser, allUsers, setAllUsers}}>
          <div className="banner"></div>
            { user? <Chat/> : <Login/> }
      </UserContext.Provider>
    );
}
