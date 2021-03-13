import React from 'react';
import Head from 'next/head';
import { Provider } from 'react-redux'
import { applyMiddleware, createStore  } from 'redux';
import thunk from "redux-thunk"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'
import { stationsReducer } from '../Redux/reducer/addStationInformationInStore';


function MyApp({ Component, pageProps }) {

    const persistConfig = {
        key: 'root',
        storage,
    }
    const persistedReducer = persistReducer(persistConfig, stationsReducer)
    const store = createStore(persistedReducer, applyMiddleware(thunk));
    const persistor = persistStore(store);

    return (
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Head>
                <title>Achieve 3000</title>
            </Head>
            <Component {...pageProps} />
          </PersistGate>
        </Provider>
    );
  };
  
export default MyApp;