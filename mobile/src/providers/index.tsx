import React, {createContext, useState} from 'react';
import ccxt from 'ccxt';

import {appContext} from './consts';

export const AppContext = createContext(appContext);
export const AppDispatchContext = createContext(appContext);
const createInitialAppData = () => {
  const defaultExchangeId = 'binance';
  return new ccxt[defaultExchangeId]();
};

export function AppProvider({children}: {children: React.JSX.Element}) {
  const [data, dispatch] = useState(createInitialAppData());

  return (
    <AppContext.Provider value={data}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}
