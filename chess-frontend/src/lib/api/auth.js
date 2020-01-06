import axios from 'axios';

export const getSession = () =>
    axios.get('/api/auth/getSession');

export const login = ({ username, password }) => 
    axios.post('/api/auth/login', ({ username, password }));

export const logout = () =>
    axios.get('/api/auth/logout');

export const register = ({ username, password }) =>
    axios.post('/api/auth/register', ({ username, password }));