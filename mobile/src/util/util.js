import {Alert} from 'react-native';

export const AlertError = err => Alert.alert('Error', err?.message);

export const AskReview = (afterMillis = 5000) => {
  setTimeout(() => {}, afterMillis);
};
