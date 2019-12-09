import axios from 'axios';

export const sendMessage = message =>
    axios.post('/api/chat/sendMessage', message);