import React from 'react';
import styled from 'styled-components';
import { FaFastBackward, FaStepBackward, FaFastForward, FaStepForward } from 'react-icons/fa';
import { IconContext } from 'react-icons';

const UndoRedoBlock = styled.div`
    position: absolute;
    top: 300px;
    display: flex;
    width: 100%;
    height: 30px;
    background-color: rgb(247, 246, 245);
    z-index: 10;
    box-shadow: rgba(0, 0, 0, 0.14) 0px -2px 2px 0px, rgba(0, 0, 0, 0.2) 0px -3px 1px -2px, rgba(0, 0, 0, 0.12) 0px -1px 5px 0px;
`;

const ButtonBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
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
}

const UndoRedo = ({ onStepUndo, onStepRedo, onFastUndo, onFastRedo}) => {
    
    return (
        <UndoRedoBlock>
            <ButtonBlock onClick={onFastUndo}>
                <IconContext.Provider value={buttonStyle}>
                    <FaFastBackward/>
                </IconContext.Provider>
            </ButtonBlock>
            <ButtonBlock onClick={onStepUndo}>
                <IconContext.Provider value={buttonStyle}>
                    <FaStepBackward/>
                </IconContext.Provider>
            </ButtonBlock>
            <ButtonBlock onClick={onStepRedo}>
                <IconContext.Provider value={buttonStyle}>
                    <FaStepForward/>
                </IconContext.Provider>
            </ButtonBlock>
            <ButtonBlock onClick={onFastRedo}>
                <IconContext.Provider value={buttonStyle}>
                    <FaFastForward/>
                </IconContext.Provider>
            </ButtonBlock>
        </UndoRedoBlock>
    )
};

export default React.memo(UndoRedo);