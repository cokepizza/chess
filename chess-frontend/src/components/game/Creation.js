import React from 'react';
import styled from 'styled-components';
import { FaChessKing } from 'react-icons/fa';
import { IconContext } from 'react-icons';

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

const IconBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    cursor: pointer;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);

    background-color: ${props => props.checked && 'rgba(0,0,0,0.1)' };
    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
`;

const SubmitBlock = styled.div`
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
`;

const ConfirmBlock = styled.button`
    width: 130px;
    height: 30px;
    cursor: pointer;
    border: none;
    outline: none;
    margin: 0;
    font-size: 15px;
    font-weight: 500;
    /* box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12); */
`;

const ResetBlock = styled.button`
    margin-left: 20px;
    width: 130px;
    height: 30px;
    cursor: pointer;
    border: none;
    outline: none;
    margin: 0;
    font-size: 15px;
    font-weight: 500;
    /* box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12); */
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
    const whiteStyle = {
        style: {
            color: 'white',
            filter: `drop-shadow(1px 1px 1px black)`,
            width: '30px',
            height: '30px',
        }
    };

    const blackStyle = {
        style: {
            color: 'black',
            filter: `drop-shadow(1px 1px 1px white)`,
            width: '30px',
            height: '30px',
        }
    };

    return (
        <CreationBlock onSubmit={onSubmit}>
            <TitleBlock>
                New Game
            </TitleBlock>
            <SelectionBundleBlock>
                <SelectionContainer kind='map' />
                <SelectionContainer kind='type' />
            </SelectionBundleBlock>
            <SliderBundleBlock>
                <SliderContainer kind='defaultTime'/>
                <SliderContainer kind='extraTime'/>
            </SliderBundleBlock>
            <IconBundleBlock>
                <NameBlock>
                    Piece
                </NameBlock>
                <IconBlock checked>
                    <IconContext.Provider value={whiteStyle}>
                        <FaChessKing />
                    </IconContext.Provider>
                </IconBlock>
                <IconBlock>
                    <IconContext.Provider value={blackStyle}>
                        <FaChessKing />
                    </IconContext.Provider>
                </IconBlock>
            </IconBundleBlock>
            <SubmitBlock>
                <ConfirmBlock type='submit' >
                    Create
                </ConfirmBlock>
                <ResetBlock type='button'>
                    Reset
                </ResetBlock>
            </SubmitBlock>
        </CreationBlock>
    )
};

export default React.memo(Creation);