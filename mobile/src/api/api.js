import firestore from '@react-native-firebase/firestore';
import firebaseAuth from '@react-native-firebase/auth';
import Binance from '../context/Binance';

const INITIAL_BALANCE = 1000000;

export function addOrRemoveFavourite(a, u, symbol) {
  return UserCollection.doc(a.uid).update({
    favoritePairs: u.favoritePairs.includes(symbol)
      ? firestore.FieldValue.arrayRemove(symbol)
      : firestore.FieldValue.arrayUnion(symbol),
  });
}

const PromsieAny = x =>
  new Promise((res, rej) => {
    let rejCnt = 0;
    const locRej = er => {
      rejCnt++;
      if (rejCnt === x.length) {
        rej(er);
      }
    };
    x.forEach(v => v.then(res).catch(locRej));
  });

export async function trade(curAuth, curUser, fromAsset, toAsset, quantity) {
  const tick = await PromsieAny([
    Binance.instance().ticker(fromAsset + toAsset),
    Binance.instance().ticker(toAsset + fromAsset),
  ]);
  const realPrice = tick.symbol.startsWith(fromAsset)
    ? parseFloat(tick.price)
    : 1 / parseFloat(tick.price);
  const destinationQuantity = quantity * realPrice;
  if (curUser.wallet[fromAsset] < quantity) {
    throw new Error('Insufficent ' + fromAsset + ' funds');
  }
  await Promise.all([
    UserCollection.doc(curAuth.uid).update({
      [`wallet.${fromAsset}`]: firestore.FieldValue.increment(-quantity),
      [`wallet.${toAsset}`]:
        firestore.FieldValue.increment(destinationQuantity),
    }),
    TransactionsCollection(curAuth.uid).add({
      fromAsset,
      toAsset,
      quantity,
      price: realPrice,
    }),
  ]);
}

export function removeAlert(curAuth, id) {
  return AlertsCollection(curAuth.uid).doc(id).delete();
}

export const UserCollection = firestore().collection('users');
export const TransactionsCollection = uid =>
  UserCollection.doc(uid).collection('transactions');
export const AlertsCollection = uid =>
  UserCollection.doc(uid).collection('alerts');
export async function logout(auth) {
  await firebaseAuth().signOut();
}

export function addAlert(curAuth) {
  return async (symbol, percentage) => {
    const tick = await Binance.instance().ticker(symbol);
    const priceTop = parseFloat(tick.price) * (1 + percentage);
    const priceBottom = parseFloat(tick.price) * (1 - percentage);
    return AlertsCollection(curAuth.uid).add({
      percentage,
      symbol,
      priceTop,
      priceBottom,
      uid: curAuth.uid,
    });
  };
}

export async function login(email, password) {
  const res = await firebaseAuth().signInWithEmailAndPassword(email, password);
  if (!res.user) {
    return Promise.reject('Error');
  }
  return res.user;
}

export async function signInAnonymously() {
  const rnd = Math.floor(Math.random() * 1000 + 1000) + Date.now();
  const auth = await firebaseAuth().signInAnonymously();
  if (!auth.user) {
    return Promise.reject('error while creating user');
  }
  return finalizeSignup('Anonymous', rnd + '@crypto-rocket.web.app', auth.user);
}
export async function signup(name, email, password) {
  const auth = await firebaseAuth().createUserWithEmailAndPassword(
    email,
    password,
  );
  if (!auth.user) {
    return Promise.reject('error while creating user');
  }
  return finalizeSignup(name, email, auth.user);
}
async function finalizeSignup(name, email, authUser) {
  const existingUser = await UserCollection.doc(authUser.uid).get();
  if (existingUser.exists) {
    return {auth: authUser, user: existingUser.data()};
  } else {
    const newUser = {
      name,
      wallet: {USDT: INITIAL_BALANCE},
      email,
      favoritePairs: [],
      notificationTokens: [],
    };
    await UserCollection.doc(authUser.uid).set(newUser);
    await addAlert(authUser)('BTCUSDT', 0.01);
    return {auth: authUser, user: newUser};
  }
}
