import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import Colors from '../constants/Colors';
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useExchangeInfo} from '../hooks/useExchangeInfo';
import {use24HrTicker} from '../hooks/use24HrTicker';
import {CryptoAssetImageUri} from '../util/CryptoAssetImageUri';
import {useAuth} from '../context/AuthContext';

export default function TrendingScreen(props) {
  const handleSymbolPressed = React.useCallback(
    tick => {
      props.navigation.navigate('Chart', {symbol: tick.symbol});
    },
    [props.navigation],
  );

  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <Header title="Trending" />
      <Pairs onItemPressed={handleSymbolPressed} />
    </View>
  );
}

export function Pairs(props) {
  const {data, isValidating, revalidate} = use24HrTicker();
  const [q, setQ] = useState('');
  const exInfo = useExchangeInfo();
  const [favOnly, setFavOnly] = useState(false);

  const toggleFavOnly = React.useCallback(
    () => setFavOnly(t => !t),
    [setFavOnly],
  );

  const entries = React.useMemo(() => {
    return (data ?? [])
      .filter(x =>
        q.length === 0
          ? x.symbol.endsWith('USDT')
          : x.symbol.includes(q.toUpperCase()),
      )
      .slice(0, favOnly ? undefined : 30);
  }, [q, data, favOnly]);

  return (
    <>
      <View style={{paddingHorizontal: 20}}>
        <SearchBar onChange={setQ} />
        <TouchableOpacity
          onPress={toggleFavOnly}
          style={{paddingVertical: 10, alignSelf: 'flex-end'}}>
          <Text
            style={{color: favOnly ? '#F0B90B' : 'gray', fontWeight: 'bold'}}>
            Favourites only
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        contentContainerStyle={{paddingHorizontal: 20, paddingVertical: 10}}
        refreshControl={
          <RefreshControl refreshing={isValidating} onRefresh={revalidate} />
        }
        data={entries}
        ItemSeparatorComponent={() => (
          <View style={{borderTopWidth: 1, borderColor: Colors.lightgray}} />
        )}
        ListEmptyComponent={
          isValidating ? <></> : <Text>No pairs found 🤷‍♂️</Text>
        }
        renderItem={({item}) => (
          <Row item={item} exInfo={exInfo} onPress={props.onItemPressed} />
        )}
        keyExtractor={it => it.symbol}
      />
    </>
  );
}

function Row({item, exInfo, onPress}) {
  const handlePress = React.useCallback(() => onPress(item), [item, onPress]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{flexDirection: 'row', paddingVertical: 10}}>
      <CryptoAssetImage
        asset={exInfo.map[item.symbol]?.baseAsset?.toLowerCase()}
      />
      <View style={{flex: 1, paddingVertical: 5, paddingLeft: 8}}>
        <Text style={{fontWeight: '600'}}>{item.symbol}</Text>
        <Text style={{color: Colors.gray}}>
          {parseFloat(item.priceChangePercent) >= 0 ? '+' : ''}
          {item.priceChangePercent}%
        </Text>
      </View>
      <View style={{paddingVertical: 5, alignItems: 'flex-end'}}>
        <Text style={{fontWeight: '600'}}>
          {parseFloat(item.lastPrice).toFixed(2)}
        </Text>
        {/* {isFavourite && (
          <AntDesign name={'star'} style={{fontSize: 15, color: '#F0B90B'}} />
        )} */}
      </View>
    </TouchableOpacity>
  );
}

export function CryptoAssetImage(props) {
  const [hasFailed, setHasFailed] = useState(false);

  return (
    <View
      style={{
        width: 56,
        height: 56,
        borderRadius: 20,
        backgroundColor: '#faeffa',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {!hasFailed ? (
        <Image
          source={{uri: CryptoAssetImageUri(props.asset?.toLowerCase() ?? '')}}
          style={{width: 32, height: 32}}
          onError={() => setHasFailed(true)}
        />
      ) : (
        <Text>{props.asset?.substr(0, 5).toLocaleUpperCase()}</Text>
      )}
    </View>
  );
}
