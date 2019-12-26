import React from 'react';
import styled from 'styled-components';

const PieceMoveBlock = styled.div`
    width: 100%;
    height: 30px;
    background-color: #ccc;
`;

const PieceMove = ({ moves, onClickBlock }) => {

    if(moves) {
        return (
            <>
                {moves.map(move => (
                    <PieceMoveBlock onClick={onClickBlock}>
                        {move}
                    </PieceMoveBlock>
                ))}
            </>
        )
    }
    return (
        <PieceMoveBlock />
    )
    
};

export default React.memo(PieceMove);