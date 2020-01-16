import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { HelmetProvider } from 'react-helmet-async';

import './index.css';
import App from './App';
import rootReducer, { rootSaga } from './modules';
import * as serviceWorker from './serviceWorker';
import { getLocalStorage, clearLocalStorage } from './lib/storage/storage';
import { checkThunk } from './modules/sessionAuth';
import FixSize from './components/common/FixSize';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(ReduxThunk, sagaMiddleware))
)

sagaMiddleware.run(rootSaga);

(async() => {
    const auth = getLocalStorage('auth');
    if(!auth) {
        return;
    }

    try {
        const checkedAuth = await store.dispatch(checkThunk());
        if(checkedAuth.username !== auth.username) {
            clearLocalStorage();
            //  eslint-disable-next-line
            throw 'Auth mismatch';
        }
    } catch(e) {
        console.dir('Check auth failed');
    }
})();

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <HelmetProvider>
                <FixSize>
                    <App />
                </FixSize>
            </HelmetProvider>
        </BrowserRouter>
    </Provider>
    ,document.getElementById('root')
);

serviceWorker.unregister();