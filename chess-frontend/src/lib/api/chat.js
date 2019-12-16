import axios from 'axios';

export const sendMessage = message =>
    axios.post('/api/chat/sendMessage', message);
    
// export const sendMessage = message =>
//     axios.post('http://localhost:5000/api/chat/sendMessage', message);