import React, { useEffect, useContext } from "react";
import { UserContext } from './App';
import { API_ENDPOINT, BUNQ_COLORS } from "../const";

function Login() {
    const { setUser, allUsers, setAllUsers } = useContext(UserContext);

    useEffect( () => {
      fetch(`${API_ENDPOINT}/users`)
        .then(res => res.json())
        .then(res => {
          setAllUsers(res);
        });
    }, []);

    function getColorForUser(user) {
      if (BUNQ_COLORS[user.id-1]) {
        return BUNQ_COLORS[user.id-1];
      } else {
        return 'black';
      }
    }

    return (
      <div>
        <div className="login__title">Welcome to bunq chat!</div>
        <div className="login__subtitle">Please select a user</div>
        <div className="login">
          { allUsers.map((user, i) => (
              <div className="login__user" key={i} onClick={() => setUser(user)}>
                <div className="login__avatar" style={{ 'backgroundColor': getColorForUser(user) }}></div>
                <span className="login__name">{user.name}</span>
              </div>
            )) 
          }
        </div>
        <div className="footer">
          <img className="footer__logo" src={require('../assets/logo.png')}/>
        </div>
      </div>
      );
}

export default Login;