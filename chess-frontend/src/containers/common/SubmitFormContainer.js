import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import SubmitForm from '../../components/common/SubmitForm';
import { disconnectWebsocket, createGameThunk } from '../../modules/games';

const SubmitFormContainer = ({ history, onCancelClick, ...rest }) => {
    const dispatch = useDispatch();

    const onConfirmClick = useCallback(e => {
        e.preventDefault();
        (async() => {
            dispatch(disconnectWebsocket());
            const key = await dispatch(createGameThunk());
            onCancelClick();
            history.push(`/game/${key}`);
        })();
    }, [dispatch, history, onCancelClick]);

    return (
        <SubmitForm
            {...rest}    
            onConfirmClick={onConfirmClick}
            onCancelClick={onCancelClick}    
        />
    )
};

export default withRouter(SubmitFormContainer);