import React, {useContext, useEffect, useState} from 'react';
import firebaseAuth from '@react-native-firebase/auth';
import {Nothing, Maybe, Just} from '../util/Maybe';
import * as api from '../api/api';

export const AuthContext = React.createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
  const [auth, setAuth] = useState(Nothing());
  const [user, setUser] = useState(Nothing());
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    console.log('auth', auth);
    let prevUserSub = () => {};
    let prevAlertsSub = () => {};
    firebaseAuth().onAuthStateChanged(u => {
      prevUserSub();
      prevAlertsSub();
      if (u) {
        setAuth(Just(u));
        // api.addUserNotificationToken(u);
        prevUserSub = api.UserCollection.doc(u.uid).onSnapshot(snap => {
          const uData = snap.data();
          if (uData) {
            setUser(Just(uData));
          }
        });
        prevAlertsSub = api
          .AlertsCollection(u.uid)
          .onSnapshot(({docs}) =>
            setAlerts(docs.map(doc => ({id: doc.id, data: doc.data()}))),
          );
      } else {
        setAuth(Nothing());
        setUser(Nothing());
        setAlerts([]);
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        alerts,
        user,
        login: (email, password) => api.login(email, password),
        signup: async (name, email, password) => {
          const res = await api.signup(name, email, password);
          setAuth(Just(res.auth));
          setUser(Just(res.user));
          return res.auth;
        },
        logout: async () => {
          await api.logout(auth.getOrThrow());
          setUser(Nothing());
          setAuth(Nothing());
        },
        signInAnonimously: async () => {
          const res = await api.signInAnonymously();
          setAuth(Just(res.auth));
          setUser(Just(res.user));
          return res.auth;
        },
        addOrRemoveFavourite: symbol =>
          api.addOrRemoveFavourite(
            auth.getOrThrow(),
            user.getOrThrow(),
            symbol,
          ),
        trade: (fromAsset, toAsset, quantity) =>
          api.trade(
            auth.getOrThrow(),
            user.getOrThrow(),
            fromAsset,
            toAsset,
            quantity,
          ),
        addAlert: (symbol, percentage) =>
          api.addAlert(auth.getOrThrow())(symbol, percentage),
        removeAlert: id => api.removeAlert(auth.getOrThrow(), id),
        signInWithApple: async () => {
          const res = await api.signInWithApple();
          setAuth(Just(res.auth));
          setUser(Just(res.user));
          return res.auth;
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
