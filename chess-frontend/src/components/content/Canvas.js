import React, {useCallback} from 'react';
import styled, { css } from 'styled-components';
import { IconContext } from 'react-icons';
import { GiChessPawn, GiChessKing, GiChessQueen,
    GiChessBishop, GiChessKnight, GiChessRook, GiPlainCircle } from 'react-icons/gi';

const pieceMapper = {
    'pawn': GiChessPawn,
    'king': GiChessKing,
    'queen': GiChessQueen,
    'bishop': GiChessBishop,
    'knight': GiChessKnight,
    'rook': GiChessRook,
    'covered': GiPlainCircle,
}

const playerMapper = {
    'white': {
        color: 'white',
        style: {
            width: '80%',
            height: '80%',
        }
    },
    'black': {
        color: 'black',
        style: {
            // filter: `drop-shadow(2px 4px 6px black)`,
            width: '80%',
            height: '80%',
        }
    },
    'covered': {
        style: {
            width: '30%',
            height: '30%',
            opacity: 0.5,
        }
    }
}

const pieceConverter = ({ piece, owner, covered }) => {
    let coveredCanvas = null;
    
    if(covered) {
        const Component = pieceMapper['covered'];

        coveredCanvas = (
            <IconContext.Provider value={playerMapper['covered']}>
                <Component />
            </IconContext.Provider>
        );
    }

    if(!piece || !owner) {
        return coveredCanvas;
    }

    const Component = pieceMapper[piece];
    const capturedObject = coveredCanvas ? {
        opacity: 0.5,
    } : null;

    const styleObject = {
        ...playerMapper[owner],
        style: {
            ...playerMapper[owner].style,
            ...capturedObject,
        }
    };

    return (
        <IconContext.Provider value={styleObject}>
            <Component />
        </IconContext.Provider>
    )
};

const CanvasBackgroundBlock = styled.div`
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    border: 10px solid black;
    box-sizing: border-box;
    z-index: 0;
`;

const CanvasBlock = styled.div`
    position: relative;
    border: 1px solid black;
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
    z-index: 1;
    &:hover {
        border: 1px solid pink;
    }

    &:active {
        background-color: skyblue;
    }

    ${props => props.cellnum === 0 && css`
        background-color: rgb(254, 206, 158);
    `}
    ${props => props.cellnum === 1 && css`
        background-color: rgb(211, 138, 69);   
    `}
    ${props => props.covered && css`
        border: 1px solid white;
    `}
`

const CanvasRow = React.memo(({ row, y, onClickCell, pieceConverter }) => {
    // console.dir('Canvas Row');
    return (
        <CanvasRowBlock>
            {row.map((cell, x) => (
                <CanvasCell
                    key={`cell_${y}_${x}`}
                    onClick={onClickCell.bind(null, {y, x})}
                    pieceConverter={pieceConverter}
                    cellnum={(x + y) % 2}
                    cell={cell}
                />
            ))}
        </CanvasRowBlock>
    )
}, (prevProps, nextProps) => {
    return prevProps.row === nextProps.row;
});

const CanvasCell = React.memo(({ cell, pieceConverter, ...rest }) => {
    // console.dir('Canvas Cell')
    return (
        <CanvasCellBlock
            {...rest}
        >
            {pieceConverter({
                piece: cell.piece,
                owner: cell.owner,
                covered: cell.covered,
            })}
        </CanvasCellBlock>
    )
}, (prevProps, nextProps) => {
    return prevProps.cell === nextProps.cell;
});

const CanvasContent = ({ board, onClick }) => {
    //  can't memoization
    const onClickCell = useCallback(({y, x}) => {
        onClick(y, x);
    }, [onClick]);

    // console.dir('-----------------------------------------------');

    return  (
        <>
            {board.map((row, y) => (
                <CanvasRow
                    key={`row_${y}`}
                    row={row}
                    y={y}
                    onClickCell={onClickCell}
                    pieceConverter={pieceConverter}
                />
            ))}
        </>
    )
}

const Canvas = props => {
    return (
        <CanvasBlock>
            <CanvasBackgroundBlock></CanvasBackgroundBlock>
            <CanvasContent {...props} />
        </CanvasBlock>
    )
};

export default React.memo(Canvas);