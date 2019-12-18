import axios from 'axios';

export const movePiece = params =>
    axios.post('/api/canvas/movePiece', params);