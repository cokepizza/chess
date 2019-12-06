import React from 'react';
import styled, { css } from 'styled-components';

const CanvasBlock = styled.div`
    position: relative;
    border: 1px solid black;
    background-color: blue;
`;

const CanvasRowBlock = styled.div`
    display: flex;
`;

const CanvasCellBlock = styled.div`
    display: flex;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    width: 90px;
    height: 90px;
    border: 1px solid black;
    &:hover {
        border: 1px solid pink;
    }

    &:active {
        background-color: skyblue;
    }

    ${props => props.covered && css`
        border: 1px solid white;
    `}
`

const CanvasContent = ({ board, onClick }) => {
    return  (
        <>
            {
                board.map((rowState, y) => (
                    <CanvasRowBlock
                        key={`row+${y}`}
                    >
                        {rowState.map((cell, x) => (
                            <CanvasCellBlock
                                key={`cell+${x}`}
                                onClick = {e => onClick(e, y, x)}
                                covered ={cell.covered}
                            >
                                {cell.piece ? cell.piece : null}
                            </CanvasCellBlock>
                        ))
                        }
                    </CanvasRowBlock>
                ))
            }
        </>
    )
}

const Canvas = props => {
    return (
        
            <CanvasBlock>
                <CanvasContent {...props} />
            </CanvasBlock>
        
    )
};

export default React.memo(Canvas);