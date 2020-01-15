import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Icon from '../../components/game/Icon';
import { changeField } from '../../modules/create';

const IconContainer = ({ white, black }) => {
    const { piece } = useSelector(({ create }) => ({
        piece: create.piece,
    }));

    const dispatch = useDispatch();
    
    const onClick = useCallback(value => {
        dispatch(changeField({
            key: 'piece',
            value,
        }))
    }, [dispatch]);

    const kind = white ? 'white': (black ? 'black' : null);
    const checked = piece === kind;
    
    return (
        <Icon
            kind={kind}
            checked={checked}
            onClick={onClick}
        />
    )
};

export default IconContainer;