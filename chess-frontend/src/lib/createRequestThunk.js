export const createRequestActionTypes = type => {
    const SUCCESS = `${type}_SUCCESS`;
    const FAILURE = `${type}_FAILURE`;
    return [ type, SUCCESS, FAILURE ];
};

export default function createRequestThunk (type, request) {
    const SUCCESS = `${type}_SUCCESS`;
    const FAILURE = `${type}_FAILURE`;
    return params => async dispatch => {
        try {
            const response = await request(params);
            dispatch({
                type: SUCCESS,
                payload: response.data,
            });
            return response.data;
        } catch(e) {
            console.dir(e);
            dispatch({
                type: FAILURE,
                payload: e,
                error: true,
            });
            throw e;
        }
    }
};