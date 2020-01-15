import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Slider from '../../components/game/Slider';
import { changeField } from '../../modules/create';

const SliderContainer = ({ kind }) => {
    const { value, config } = useSelector(({ create }) => ({
        value: create[kind],
        config: create.config[kind],
    }));
    const dispatch = useDispatch();

    const onChange = useCallback(e => {
        dispatch(changeField({
            key: kind,
            value: e.target.value,
        }));
    }, [dispatch, kind]);

    return (
        <Slider
            onChange={onChange}
            kind={kind}
            value={value}
            config={config}
        />
    )
};

export default SliderContainer;