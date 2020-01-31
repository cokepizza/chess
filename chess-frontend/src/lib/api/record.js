import axios from 'axios';

export const asking = params =>
    axios.post('/api/record/asking', params);

export const answering = params =>
    axios.post('/api/record/answering', params);