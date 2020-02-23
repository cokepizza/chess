import axios from 'axios';

export const createPost = params =>
    axios.post('/api/community', params);

export const readPost = ({ id }) =>
    axios.get(`/api/community?id=${id}`);

export const updatePost = params =>
    axios.patch('/api/community', params);

export const deletePost = params =>
    axios.delete('/api/community', params);