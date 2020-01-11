import axios from 'axios';

//  REST API 방식

export const createGame = () =>
    axios.post('/api/games');