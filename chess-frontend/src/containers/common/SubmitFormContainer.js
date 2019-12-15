import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import SubmitForm from '../../components/common/SubmitForm';
import { createRoomThunk } from '../../modules/room';

const SubmitFormContainer = ({ onCancelClick, ...rest }) => {
    const dispatch = useDispatch();

    const onConfirmClick = useCallback(e => {
        e.preventDefault();
        dispatch(createRoomThunk());
    }, []);

    return (
        <SubmitForm
            {...rest}    
            onConfirmClick={onConfirmClick}
            onCancelClick={onCancelClick}    
        />
    )
};

export default SubmitFormContainer;