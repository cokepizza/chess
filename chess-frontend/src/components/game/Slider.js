import React from 'react';
import styled from 'styled-components';

const SliderFrameBlock = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    & + & {
        margin-top: 15px;
    }
`;

const SliderBoxBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const SliderBlock = styled.input`
    -webkit-appearance: none;
    width: 150px;
    height: 30px;
    cursor: pointer;
    background: ${props => {
        if(props.kind === 'defaultTime') {
            // return `linear-gradient(to right, #16a085 0%, black 100%)`;
            return `linear-gradient(to right, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.6) 100%)`;
        } else {
            // return `linear-gradient(to right, red 0%, black 100%)`;
            return `linear-gradient(to right, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.6) 100%)`;
        }
    }};
    background-size: 140px 5px;
    background-position: center;
    background-repeat: no-repeat;
    overflow: hidden;
    outline: none;
    /* zoom: 100%; */
    display: block;

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 10px;
        height: 10px;
        box-shadow: 0 2px 2px 0 rgba(0,0,0,0.36), 0 3px 1px -2px rgba(0,0,0,0.6), 0 1px 5px 0 rgba(0,0,0,0.36);
        position: relative;
        background-color: rgba(255,255,255, 0.8);
        z-index: 3;
    };
`;

const NameBlock = styled.div`
    position: absolute;
    top: -10px;
    left: 70%;
    width: 30%;
    display: flex;
    justify-content: flex-end;
    font-weight: 500;
    font-size: 12px;
    color: rgba(0,0,0,0.3);
`

const ValueBlock = styled.div`
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    width: 60px;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const Slider = ({ onChange, kind, value, config }) => {
    const name = kind.substring(0, kind.length - 4);

    return (
        <SliderFrameBlock>
            <SliderBoxBlock>
                <SliderBlock
                    type='range'
                    onChange={onChange}
                    {...config}
                    kind={kind}
                    value={value}
                />
            </SliderBoxBlock>
            <ValueBlock>
                <NameBlock>
                    {name}
                </NameBlock>
                {value}
            </ValueBlock>
        </SliderFrameBlock>
    )
};

export default React.memo(Slider);