import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import rootReducer, { rootSaga } from './modules';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { getLocalStorage, clearLocalStorage } from './lib/storage/storage';
import { checkThunk } from './modules/auth';

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
            <App />
        </BrowserRouter>
    </Provider>
    ,document.getElementById('root')
);

serviceWorker.unregister();