import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import CheckOutsideOfComponent from '../../containers/HOC/CheckOutsideOfComponent';
import Selection from '../../components/game/Selection';
import { changeField } from '../../modules/create';

const SelecitonContainer = ({ kind }) => {
    const { name, list } = useSelector(({ create }) => ({
        name: create[kind],
        list: create[`${kind}List`],
    }));

    const dispatch = useDispatch();

    const { ref: reference, componentState, setComponentState } = CheckOutsideOfComponent(false);

    const onClickSelection = useCallback(() => {
        setComponentState(prevState => !prevState);
    }, [setComponentState]);

    const onClickOption = useCallback(name => {
        dispatch(changeField({
            key: kind,
            value: name,
        }));
    }, [dispatch, kind]);

    return (
        <Selection
            kind={kind}
            name={name}
            list={list}
            reference={reference}
            componentState={componentState}
            onClickSelection={onClickSelection}
            onClickOption={onClickOption}
        />
    )
};

export default SelecitonContainer;