import axios from 'axios';

export const movePiece = ({ move }) =>
    axios.post('/api/game/movePiece', move);