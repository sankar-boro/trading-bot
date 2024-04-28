import React, {createContext, useReducer} from 'react';
import {appContext} from './consts';

export const AppContext = createContext(appContext);
export const AppDispatchContext = createContext(appContext);

const initialAppData: any[] = [];

export function AppProvider({children}: {children: React.JSX.Element}) {
  const [data, dispatch] = useReducer(appReducer, initialAppData);

  return (
    <AppContext.Provider value={data}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}

function appReducer(data: any[], action: any) {
  switch (action.type) {
    case 'added': {
      return [data, action];
    }
    case 'changed': {
      return [];
    }
    case 'deleted': {
      return [];
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
