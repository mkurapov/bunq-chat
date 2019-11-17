import React, { useEffect, useState, useContext } from "react";
// import { UserContext } from '../../contexts/UserContext';
import { UserContext } from '../../containers/App/App';

const endpoint = 'http://assignment.bunq.com';

const bunqColors = ['#6f42c1', '#007bff', '#28a745', '#dc3545', '#FFC107'];
let userDictionary = {};

function Login() {
    const { setUser, allUsers, setAllUsers } = useContext(UserContext);

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
        <div class="login">
          { allUsers.map((user, i) => (
              <div class="login__user" key={i} onClick={() => setUser(user)}>
                <div class="login__avatar"></div>
                <span class="login__name">{user.name}</span>
              </div>
            )) 
          }
        </div>
      );
}

export default Login;