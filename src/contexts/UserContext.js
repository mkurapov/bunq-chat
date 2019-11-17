import React, { createContext, Component, useState } from "react";

export const UserContext = React.createContext();

export function UserProvider(props) {
    const [ user, setUser ] = useState(null);

    return (
        <UserContext.Provider value = {{ user, setUser }}>
            { props.children }
        </UserContext.Provider>
    )
}