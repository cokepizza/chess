import axios from 'axios';

//  REST API 방식

export const createRoom = () =>
    axios.post('/api/room');