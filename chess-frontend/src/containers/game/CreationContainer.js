import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';

import Creation from '../../components/game/Creation';
import { clearField } from '../../modules/create';
import { createGameThunk } from '../../modules/games';

const CreationContainer = ({ history }) => {
    const { map, mode, defaultTime, extraTime, piece } = useSelector(({ create }) => ({
        map: create.map,
        mode: create.mode,
        defaultTime: create.defaultTime,
        extraTime: create.extraTime,
        piece: create.piece,
    }));

    const dispatch = useDispatch();

    const onSubmit = useCallback(e => {
        e.preventDefault();
        (async() => {
            const key = await dispatch(createGameThunk({
                map,
                mode,
                defaultTime,
                extraTime,
                piece
            }));

            history.push(`/game/${key}`);
        })();
    }, [dispatch, history, map, mode, defaultTime, extraTime, piece]);

    useEffect(() => {
        return () => {
            dispatch(clearField());
        }
    }, [dispatch]);

    return (
        <Creation onSubmit={onSubmit}/>
    )
};

export default withRouter(CreationContainer);