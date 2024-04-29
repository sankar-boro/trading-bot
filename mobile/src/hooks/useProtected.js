import {NavigationProp, useNavigation} from '@react-navigation/core';
import {useAuth} from '../context/AuthContext';

export function useProtected() {
  const nav = useNavigation();
  const authctx = useAuth();

  return f => {
    authctx.auth.zip(authctx.user).ifPresentOrElse(f, () => {
      nav.navigate('Signup');
    });
  };
}
