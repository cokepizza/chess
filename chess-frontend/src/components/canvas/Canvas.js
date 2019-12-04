import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

const CanvasFrameBlock = styled.div`
    height: 800px;
    width: 100%;
    background-color: yellow;
    display: flex;
    justify-content: center;
    align-items: center;
`;

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
`

const CanvasContent = ({ board, onClick }) => {
    
    return  (
        <>
            {
                board.map((rowState, y) => (
                    <CanvasRowBlock>
                        {rowState.map((cell, x) => (
                            <CanvasCellBlock
                                onClick = {e => onClick(e, cell, y, x)}
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
        <CanvasFrameBlock>
            <CanvasBlock>
                <CanvasContent {...props} />
            </CanvasBlock>
        </CanvasFrameBlock>
    )
};

export default React.memo(Canvas);