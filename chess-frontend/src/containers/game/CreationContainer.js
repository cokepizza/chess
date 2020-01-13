import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router';

import Creation from '../../components/game/Creation';
import { createGameThunk } from '../../modules/games';

const CreationContainer = ({ history }) => {
    const dispatch = useDispatch();

    const onSubmit = useCallback(() => {
        (async() => {
            const key = await dispatch(createGameThunk());
            history.push(`/game/${key}`);
        })();
    }, [dispatch, history]);

    return (
        <Creation onSubmit={onSubmit}/>
    )
};

export default withRouter(CreationContainer);