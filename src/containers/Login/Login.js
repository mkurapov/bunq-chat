import React, { useEffect, useState, useContext } from "react";
// import { UserContext } from '../../contexts/UserContext';
import { UserContext } from '../../containers/App/App';

const endpoint = 'http://assignment.bunq.com';

const bunqColors = ['#6f42c1', '#007bff', '#28a745', '#dc3545', '#FFC107'];
let userDictionary = {};

function Login() {
    // static contextType = UserContext;
    const [ allUsers, setAllUsers ] = useState([]);
    // console.log('using context, ' , useContext(UserContext));
    const { user, setUser } = useContext(UserContext);
    // const { user, setUser } = useContext(UserContext);

      // Similar to componentDidMount and componentDidUpdate:
    useEffect( () => {
      fetch(`${endpoint}/users`)
        .then(res => res.json())
        .then(res => { 
          res.forEach(u => {
            userDictionary[u.id] = u.name;
          });
          setAllUsers(res);
        });
    }, []);

    return (
        <div>
          { allUsers.map((user, i) => (
              <div key={i} onClick={() => setUser(user)}>{user.name}</div>
            )) 
          }
        </div>
      );
}

export default Login;