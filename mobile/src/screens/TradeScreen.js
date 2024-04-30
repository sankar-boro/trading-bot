import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {View, Text, Alert, TouchableOpacity} from 'react-native';
import Button from '../components/Button';
import Input from '../components/Input';
import StackHeader from '../components/StackHeader';
import Colors from '../constants/Colors';
import {useAuth} from '../context/AuthContext';
import Binance from '../context/Binance';
import {useLoading} from '../context/LoadingContext';
import {useExchangeInfo} from '../hooks/useExchangeInfo';
// import {Just, Nothing} from '../util/Maybe';
import {AlertError, AskReview} from '../util/util';

export default function TradeScreen(props) {
  const ctx = useAuth();

  function handleSignupPressed() {
    props.navigation.navigate('Signup');
  }

  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <StackHeader title={props.route.params.symbol} />
      {/* {ctx.user.mapLazy(
        user => (
          <TradeBase
            user={user}
            symbol={props.route.params.symbol}
            type={props.route.params.type}
            navigationProps={props}
          />
        ),
        () => (
          <Button onPress={handleSignupPressed}>Signup</Button>
        ),
      )} */}
      <TradeBase
        user={{}}
        symbol={props.route.params.symbol}
        type={props.route.params.type}
        navigationProps={props}
      />
    </View>
  );
}

function TradeBase(props) {
  const exInfo = useExchangeInfo();
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState(1);
  const [selectedPerc, setSelectedPerc] = useState();
  const loading = useLoading();
  const ctx = useAuth();

  useEffect(
    () => Binance.instance().subscribePrice(props.symbol, setPrice),
    [props.symbol],
  );
  const tradeInfo = exInfo.map[props.symbol];

  if (!tradeInfo) {
    return <></>;
  }

  const actionAsset =
    tradeInfo[props.type === 'buy' ? 'quoteAsset' : 'baseAsset'];
  const takeAsset =
    tradeInfo[props.type === 'buy' ? 'baseAsset' : 'quoteAsset'];
  const qtynum = parseFloat(qty.replace(/,/g, '.')) || 0;
  const takeQty = qtynum * (props.type === 'sell' ? price : 1 / price);
  // const availability = props.user.wallet[actionAsset] ?? 0;
  const availability = 0;

  function handleSubmit() {
    loading(() =>
      ctx.trade(
        actionAsset,
        takeAsset,
        selectedPerc.isPresentAnd(p => p === 1) ? availability : qtynum,
      ),
    )
      .then(() => {
        props.navigationProps.navigation.pop();
        AskReview(1000);
      })
      .catch(AlertError);
  }

  function handlePercentagePressed(perc) {
    // setSelectedPerc(Just(perc));
    setQty((perc * availability).toFixed(2));
  }

  function handleChangeQty(nqty) {
    setQty(nqty);
    // setSelectedPerc(Nothing());
  }

  return (
    <View style={{padding: 20}}>
      <Input
        placeholder={`Amount in ${actionAsset}`}
        onChangeText={handleChangeQty}
        textInputProps={{keyboardType: 'decimal-pad', value: qty}}
      />
      <View style={{flexDirection: 'row', marginTop: 10}}>
        {[0.25, 0.5, 0.75, 1.0].map(x => (
          <TouchableOpacity
            style={{flex: 1, paddingHorizontal: 5, flexDirection: 'row'}}
            key={x}
            onPress={() => handlePercentagePressed(x)}>
            <View
              style={{
                flex: 1,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: Colors.gray,
                alignItems: 'center',
                // backgroundColor: selectedPerc.isPresentAnd(y => y >= x)
                //   ? Colors.gray
                //   : Colors.lightgray,
                paddingVertical: 5,
              }}>
              <Text style={{fontWeight: '500', color: '#000'}}>
                {(x * 100).toFixed(0)}%
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={{marginVertical: 20}}>
        Available:{' '}
        <Text style={{fontWeight: '600'}}>
          {availability.toFixed(4)} {actionAsset}
        </Text>
      </Text>
      <Text style={{marginVertical: 20}}>
        You will get:{' '}
        <Text style={{fontWeight: 'bold'}}>
          {takeQty.toFixed(4)} {takeAsset}
        </Text>
      </Text>
      <Button onPress={handleSubmit}>{'Market ' + props.type}</Button>
    </View>
  );
}
