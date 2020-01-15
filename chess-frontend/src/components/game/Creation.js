import React from 'react';
import styled from 'styled-components';

import SelectionContainer from '../../containers/game/SelectionContainer';
import SliderContainer from '../../containers/game/SliderContainer';

const CreationBlock = styled.form`
    padding: 30px;
    box-sizing: border-box;
    width: 100%;
    height: 420px;
    background-color: white;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const ConfirmBlock = styled.button`
    width: 300px;
    height: 100px;
    background: transparent;
    cursor: pointer;
    border: none;
    outline: none;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`

const TitleBlock = styled.div`
    font-size: 24px;
    font-weight: 700;
`;

const ContentBlock = styled.div`
    width: 100%;
    height: 50px;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
    margin-top: 20px;
`;

const SelectionBundleBlock = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
`;

const Creation = ({ onSubmit }) => {
    return (
        <CreationBlock onSubmit={onSubmit}>
            <TitleBlock>
                New Game
            </TitleBlock>
            <SelectionBundleBlock>
                <SelectionContainer kind='map' />
                <SelectionContainer kind='type' />
            </SelectionBundleBlock>
            <SliderContainer kind='defaultTime'/>
            <SliderContainer kind='extraTime'/>
        	<ConfirmBlock type ='submit' >
                Create
            </ConfirmBlock>
        </CreationBlock>
    )
};

export default React.memo(Creation);