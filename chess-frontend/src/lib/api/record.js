import axios from 'axios';

export const sendSurrender = params =>
    axios.post('/api/record/sendSurrender', params);