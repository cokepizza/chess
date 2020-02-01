import React from 'react';
import styled from 'styled-components';
import { FaExchangeAlt, FaFlag, FaHandRock } from 'react-icons/fa';
import { TiArrowBack } from 'react-icons/ti';
import { IconContext } from 'react-icons';
import ToolTipContainer from '../../containers/gameplay/ToolTipContainer';

const UtilBlock = styled.div`
    position: absolute;
    top: 30px;
    display: flex;
    width: 100%;
    height: 30px;
    z-index: 10;
    background-color: rgb(247, 246, 245);
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const ButtonBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 25%;
    height: 100%;
    cursor: pointer;

    &:hover {
        background-color: #D3D3D3;
    }
`;

const buttonStyle = {
    style: {
        color: '#4d4d4d',
        width: '50%',
        height: '50%',
        backgroundColor: 'transparent'
    }
};

const Util = ({ onReverse, onClick }) => {
    return (
        <UtilBlock>
            <ButtonBlock onClick={onReverse} >
                <IconContext.Provider value={{ style: { ...buttonStyle.style, width: '60%', height:'60%' }} }>
                    <FaExchangeAlt />
                </IconContext.Provider>
            </ButtonBlock>
            <ButtonBlock onClick={() => onClick('undo')}>
                <IconContext.Provider value={{ style: { ...buttonStyle.style, width: '80%', height:'80%' }} }>
                    <TiArrowBack />
                </IconContext.Provider>
                <ToolTipContainer type='undo' />
            </ButtonBlock>
            <ButtonBlock onClick={() => onClick('draw')}>
                <IconContext.Provider value={buttonStyle}>
                    <FaHandRock />
                </IconContext.Provider>
                <ToolTipContainer type='draw' />
            </ButtonBlock>
            <ButtonBlock onClick={() => onClick('surrender')}>
                <IconContext.Provider value={buttonStyle}>
                    <FaFlag />
                </IconContext.Provider>
                <ToolTipContainer type='surrender' />
            </ButtonBlock>
        </UtilBlock>
    )
};

export default React.memo(Util);