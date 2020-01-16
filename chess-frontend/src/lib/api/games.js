import axios from 'axios';

//  REST API 방식

export const createGame = params =>
    axios.post('/api/games', params);