import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Slider from '../../components/game/Slider';

const SliderContainer = () => {
    const { defaultTime, extraTime } = useSelector(({ create }) => ({
        defaultTime: create.defaultTime,
        extraTime: create.extraTime,
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