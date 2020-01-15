import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Slider from '../../components/game/Slider';
import { changeField } from '../../modules/create';

const SliderContainer = ({ kind }) => {
    const { time, config } = useSelector(({ create }) => ({
        time: create[kind],
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
            time={time}
            config={config}
        />
    )
};

export default SliderContainer;