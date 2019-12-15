import { createAction, handleActions } from 'redux-actions';

const INITIALIZE_WEBSOCKET = 'game/INITIALIZE_WEBSOCKET';
export const initializeWebsocket = createAction(INITIALIZE_WEBSOCKET);

const initialState = {

};

export default handleActions({

}, initialState);