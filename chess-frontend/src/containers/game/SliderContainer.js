import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Slider from '../../components/game/Slider';

const SliderContainer = ({ kind }) => {
    const { time } = useSelector(({ create }) => ({
        time: create[kind],
    }));
    const dispatch = useDispatch();

    const onChange = useCallback(e => {
        console.dir(e.target.value);

    }, []);

    return (
        <Slider
            onChange={onChange}
        />
    )
};

export default SliderContainer;