import React from 'react';
import styled, { css } from 'styled-components';
import { IconContext } from 'react-icons';
import { IoIosArrowRoundForward } from 'react-icons/io';
import { pieceMapper } from '../../lib/base/pieceConverter';

const PieceMoveListHiddenBlock = styled.div`
    height: 270px;
    width: 100%;
    overflow: hidden;
`;

const PieceMoveListBlock = styled.div`
    height: 270px;
    width: 100%;
    overflow-y: overlay;
    padding-right: 20px;
`;

const PieceMoveBlock = styled.div`
    width: 100%;
    height: 30px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:first-child {
        margin-top: 30px;
    }
`;

const moveConverter = ({x, y}) => {
    return String.fromCharCode(97 + x) + (8 - y);
}

const MoveBlock = styled.div`
    width: 80%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    ${props => props.checked && css`
        background-color: rgba(209, 228, 246, 1);
    `}

    ${props => !props.checked && css`
        &:hover {
            background-color: rgba(209, 228, 246, 0.5);
        }
    `}
`;

const TextBlock = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20%;
    font-size: 18px;
`

const IndexBlock = styled.div`
    width: 20%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    background-color: rgb(247, 246, 245);
`

const PieceMove = React.memo(({ move, index, onClick, checked }) => {
    console.dir('PieceMove');
    console.dir(move);
    const PrevComponent = pieceMapper[move.prevPiece.piece];
    const prevStyle = {
        color: move.prevPiece.owner,
        style: {
            width: '10%',
            filter: `drop-shadow(1px 1px 1px ${move.prevPiece.owner === 'white' ? 'black' : 'white'})`,
        }
    };

    const prevPiece = (
        <IconContext.Provider value={prevStyle}>
            <PrevComponent />
        </IconContext.Provider>
    )

    let NextComponent, nextStyle;

    let nextPiece = (
        <div style={{ width: '10%' }}/>
    )

    if(move.nextPiece.piece) {
        NextComponent = pieceMapper[move.nextPiece.piece];
        nextStyle = {
            color: move.nextPiece.owner,
            style: {
                width: '10%',
                filter: `drop-shadow(1px 1px 1px ${move.nextPiece.owner === 'white' ? 'black' : 'white'})`,
            }
        };
        nextPiece = (
            <IconContext.Provider value={nextStyle}>
                <NextComponent />
            </IconContext.Provider>
        )
    }

    
    return (
        <PieceMoveBlock>
            <IndexBlock>
                {index + 1}
            </IndexBlock>
            <MoveBlock
                onClick={() => onClick(index)}
                checked={checked}
            >
                {prevPiece}
                <TextBlock>
                    {moveConverter(move.prev)}
                </TextBlock>
                <IconContext.Provider value={{ style: { color: 'rgb(169,169,169)' }}}>
                    <IoIosArrowRoundForward />
                </IconContext.Provider>
                <TextBlock>
                    {moveConverter(move.next)}
                </TextBlock>
                {nextPiece}
            </MoveBlock>
        </PieceMoveBlock>
    )
});


const PieceMoveList = ({ pieceMove, onClick, showIndex, listRef }) => {
    return (
        <PieceMoveListHiddenBlock>
            <PieceMoveListBlock ref={listRef}>
                {pieceMove.map((move, index) => (
                    <PieceMove 
                        onClick={onClick}
                        move={move}
                        index={index}
                        checked={index === showIndex}
                    />
                ))}
            </PieceMoveListBlock>
        </PieceMoveListHiddenBlock>
    )
};

export default React.memo(PieceMoveList);