import axios from 'axios';

export const getSession = () =>
    axios.get('/api/auth/getSession');

export const login = ({ id, password }) => 
    axios.post('/api/auth/login');

export const logout = () =>
    axios.get('/api/auth/logout');

export const register = ({ id, password }) =>
    axios.post('/api/auth/register');