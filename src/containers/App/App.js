import React, { useContext, useState } from "react";
import Chat from '../Chat/Chat';
import Login from '../Login/Login';

// import { UserContext, UserProvider } from '../../contexts/UserContext';

export const UserContext = React.createContext();

const endpoint = 'http://assignment.bunq.com';
const conversationId = 2232;

export default function App () {
    // console.log('in app: ', user);
    let [ user, setUser ] = useState(null);
    // console.log(user);
    return (
      <UserContext.Provider value={{user, setUser}}>
          <div class="banner"></div>
            { user? <Chat/> : <Login/> }
      </UserContext.Provider>
    );
}
