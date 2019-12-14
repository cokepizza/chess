import axios from 'axios';

//  REST API 방식

export const readRoom = () =>
    axios.get('/api/room');

export const createRoom = () =>
    axios.post('/api/room');