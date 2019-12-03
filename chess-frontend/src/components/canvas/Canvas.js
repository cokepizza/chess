import React from 'react';
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
    width : 720px;
    height: 720px;
    background-color: blue;
`;

const CanvasCellBlock = styled.div`
    width: 90px;
    height: 90px;
    
    &::after {
        border-right: 1px solid black;
    }

    &::before {
        border-bottom: 1px solid black;
    }

`;

const Canvas = props => {
    return (
        <CanvasFrameBlock>
            <CanvasBlock>
                <CanvasCellBlock />
            </CanvasBlock>
        </CanvasFrameBlock>
    )
};

export default Canvas;