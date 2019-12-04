import React from 'react';
import styled from 'styled-components';

const chessState = 
[
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

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

const CanvasContent = () => {
    return  (
        <>
            {
                chessState.map(rowState => (
                    <CanvasRowBlock>
                        {rowState.map(cell => (
                            <CanvasCellBlock>
                                {cell}
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
                <CanvasContent />
            </CanvasBlock>
        </CanvasFrameBlock>
    )
};

export default Canvas;