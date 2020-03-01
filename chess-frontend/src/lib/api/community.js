import axios from 'axios';
import qs from 'qs';

export const createPost = params =>
    axios.post('/api/community', params);

export const readPost = ({ id }) =>
    axios.get(`/api/community/${id}`);

export const listPost = ({ kind, page }) => {
    const queryString = qs.stringify({
        kind,
        page,
    });

    return axios.get(`/api/community?${queryString}`);
}

export const updatePost = ({ id, ...rest }) =>
    axios.patch(`/api/community/${id}`, rest);

export const deletePost = ({ id }) =>
    axios.delete(`/api/community/${id}`);