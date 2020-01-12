import React from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router';

import Creation from '../../components/game/Creation';
import { createGameThunk } from '../../modules/games';

const CreationContainer = ({ history }) => {
    const dispatch = useDispatch();

    const onSubmit = () => {
        (async() => {
            const key = await dispatch(createGameThunk());
            history.push(`/game/${key}`);
        })();
    }

    return (
        <Creation onSubmit={onSubmit}/>
    )
};

export default withRouter(CreationContainer);