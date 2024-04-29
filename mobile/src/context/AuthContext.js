import React, {useContext, useEffect, useState} from 'react';

export const AuthContext = React.createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
  const [auth, setAuth] = useState();
  const [user, setUser] = useState();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {}, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        alerts,
        user,
        login: (email, password) => {},
        signup: async (name, email, password) => {},
        logout: async () => {},
        signInAnonimously: async () => {},
        addOrRemoveFavourite: symbol => {},
        trade: (fromAsset, toAsset, quantity) => {},
        addAlert: (symbol, percentage) => {},
        removeAlert: id => {},
        signInWithApple: async () => {},
      }}>
      {children}
    </AuthContext.Provider>
  );
};
