import React from 'react';
import styled from 'styled-components';

import SelectionContainer from '../../containers/game/SelectionContainer';
import SliderContainer from '../../containers/game/SliderContainer';
import IconContainer from '../../containers/game/IconContainer';

const CreationBlock = styled.form`
    padding: 30px;
    box-sizing: border-box;
    width: 100%;
    height: 400px;
    background-color: white;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const TitleBlock = styled.div`
    font-size: 24px;
    font-weight: 700;
`;

const SelectionBundleBlock = styled.div`
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
`;

const SliderBundleBlock = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const IconBundleBlock = styled.div`
    position: relative;
    height: 60px;
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const SubmitBlock = styled.div`
    margin-top: 30px;
    position: relative;
    display: flex;
    justify-content: flex-end;
    width: 100%;
`;

const ConfirmFrameBlock = styled.div`
    position: relative;
    width: 65px;
    height: 40px;
`;

const ConfirmBlock = styled.button`
    cursor: pointer;
    position: absolute;
    border: none;
    outline: none;
    margin: 0;
    padding: 0;
    font-size: 20px;
    font-weight: 700;
    top: 0px;
    left: 0px;
    display: flex;
    justify-content: flex-end;
    width: 65px;
    height: 40px;
    color: rgba(0, 0, 0, 0.3);
    transition: 0.5s;
    background-color: transparent;

    @keyframes jump {
        0%, 100% {
            top: 0;
        }
        50% {
            top: -3px;
        }
    }

    &:hover {
        animation: jump 0.5s 1;
        color: rgba(0, 0, 0, 0.6);
    }
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

const Creation = ({ onSubmit }) => {
    return (
        <CreationBlock onSubmit={onSubmit}>
            <TitleBlock>
                New Game
            </TitleBlock>
            <SelectionBundleBlock>
                <SelectionContainer kind='map' />
                <SelectionContainer kind='mode' />
            </SelectionBundleBlock>
            <SliderBundleBlock>
                <SliderContainer kind='defaultTime'/>
                <SliderContainer kind='extraTime'/>
            </SliderBundleBlock>
            <IconBundleBlock>
                <NameBlock>
                    Piece
                </NameBlock>
                <IconContainer white/>
                <IconContainer black/>
            </IconBundleBlock>
            <SubmitBlock>
                <ConfirmFrameBlock>
                    <ConfirmBlock type='submit' >
                        Create
                    </ConfirmBlock>
                </ConfirmFrameBlock>
            </SubmitBlock>
        </CreationBlock>
    )
};

export default React.memo(Creation);