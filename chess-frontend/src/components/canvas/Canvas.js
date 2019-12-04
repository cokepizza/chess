import React from 'react';
import styled from 'styled-components';

const chessState = 
[
    [
        {
            piece: 'rook',
        },
        {
            piece: 'knight',
        },
        {
            piece: 'bishop',
        },
        {
            piece: 'king',
        },
        {
            piece: 'queen',
        },
        {
            piece: 'bishop'
        },
        {
            piece: 'knight',
        },
        {
            piece: 'rook',    
        }
    ],
    [
        {
            piece: 'pawn',
        },
        {
            piece: 'pawn',
        },
        {
            piece: 'pawn',
        },
        {
            piece: 'pawn',
        },
        {
            piece: 'pawn',
        },
        {
            piece: 'pawn'
        },
        {
            piece: 'pawn',
        },
        {
            piece: 'pawn',    
        }
    ],
    [ {}, {}, {}, {}, {}, {}, {}, {} ],
    [ {}, {}, {}, {}, {}, {}, {}, {} ],
    [ {}, {}, {}, {}, {}, {}, {}, {} ],
    [ {}, {}, {}, {}, {}, {}, {}, {} ],
    [
        {
            piece: 'pawn',
        },
        {
            piece: 'pawn',
        },
        {
            piece: 'pawn',
        },
        {
            piece: 'pawn',
        },
        {
            piece: 'pawn',
        },
        {
            piece: 'pawn'
        },
        {
            piece: 'pawn',
        },
        {
            piece: 'pawn',    
        }
    ],
    [
        {
            piece: 'rook',
        },
        {
            piece: 'knight',
        },
        {
            piece: 'bishop',
        },
        {
            piece: 'queen',
        },
        {
            piece: 'king',
        },
        {
            piece: 'bishop'
        },
        {
            piece: 'knight',
        },
        {
            piece: 'rook',    
        }
    ]
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
                <CanvasContent />
            </CanvasBlock>
        </CanvasFrameBlock>
    )
};

export default React.memo(Canvas);