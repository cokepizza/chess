import React from 'react';
import styled from 'styled-components';

const SelectionFrameBlock = styled.div`
    position: relative;
`

const SelectionBlock = styled.div`
    width: 130px;
    height: 30px;
    box-sizing: border-box;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
    padding-left: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    
    cursor: pointer;
    &:active {
        background-color: #ccc;
    }
`

const SelecitonToolTipFrameBlock = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    margin-top: 40px;
    z-index: 10;
    background-color: white;
    display: flex;
    flex-direction: column;
    width: 130px;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const SelectionToolTipBlock = styled.div`
    width: 100%;
    box-sizing: border-box;
    height: 30px;
    padding-left: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;

    &:hover {
        background-color: #ccc;
    }
`;

const Selection = ({
    name,
    list,
    reference,
    componentState,
    onClickSelection,
    onClickOption
}) => {    
    return (
        <SelectionFrameBlock>
            <SelectionBlock
                ref={reference}
                onClick={onClickSelection}
            >
                {name}
            </SelectionBlock>
            {componentState && (
                <SelecitonToolTipFrameBlock>
                    {list.map(optionName => (
                        <SelectionToolTipBlock
                            key={optionName}
                            onClick={() => onClickOption(optionName)}
                        >
                            {optionName}
                        </SelectionToolTipBlock>
                    ))}
                </SelecitonToolTipFrameBlock>
            )}
        </SelectionFrameBlock>
    );
};

export default Selection;