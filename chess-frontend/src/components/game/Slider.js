import React from 'react';
import styled from 'styled-components';

const SliderBlock = styled.input`
    -webkit-appearance: none;
    width: 160px;
    height: 30px;
    margin: 10px 50px;
    background: linear-gradient(to right, #16a085 0%, black 100%);
    /* background: linear-gradient(to right, rgb(22,160,133, 0.5) 0%, rgba(0,0,0,0.14) 100%); */
    background-size: 150px 10px;
    background-position: center;
    background-repeat: no-repeat;
    overflow: hidden;
    outline: none;
    zoom: 130%;
    display: block;
    margin: auto;
    margin-bottom: 30px;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
        position: relative;
        background-color: rgba(255,255,255, 0.8);
        z-index: 3;
    }

    &::-webkit-slider-thumb:after {
        content: " ";
        width: 160px;
        height: 10px;
        position: absolute;
        z-index: 1;
        right: 20px;
        top: 5px;
        background: #2ecc71;
    }

`;

const Slider = ({ onChange, kind, time }) => {
    return (
        <SliderBlock
            type='range'
            onChange={onChange}
            defaultValue={0}
            kind={kind}
            value={time}
        />
    )
};

export default Slider;