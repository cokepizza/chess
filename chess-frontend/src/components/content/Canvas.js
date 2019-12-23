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
            filter: `drop-shadow(1px 1px 1px white)`,
            width: '80%',
            height: '80%',
        }
    },
    'black': {
        color: 'black',
        style: {
            filter: `drop-shadow(1px 1px 1px black)`,
            width: '80%',
            height: '80%',
        }
    },
    'covered0': {
        style: {
            filter: `drop-shadow(1px 1px 1px black)`,
            width: '30%',
            height: '30%',
            color: 'rgb(130, 151, 105)',
            
        }
    },
    'covered1': {
        style: {
            filter: `drop-shadow(1px 1px 1px black)`,
            width: '30%',
            height: '30%',
            color: 'rgb(100, 111, 64)',
        }
    }
}

const pieceConverter = ({ piece, owner, covered, cellNum }) => {
    let coveredCanvas = null;
    
    if(covered) {
        const Component = pieceMapper['covered'];

        coveredCanvas = (
            <IconContext.Provider value={playerMapper[`covered${cellNum}`]}>
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
        filter: owner === 'black' ? `drop-shadow(1px 1px 1px white)` : `drop-shadow(1px 1px 1px black)`,
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

const CanvasBlock = styled.div`
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
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

    ${props => props.cellNum === 0 && css`
        background-color: rgb(240, 217, 181);
    `}

    ${props => props.cellNum === 1 && css`
        background-color: rgb(181, 136, 99);
    `}

    ${props => props.cellNum === 0 && props.clicked && css`
        background-color: rgb(130, 151, 105);
    `}

    ${props => props.cellNum === 1 && props.clicked && css`
        background-color: rgb(100, 111, 64);
    `}

    
    &:hover {
        ${props => props.cellNum === 0 && props.covered && css`
            background-color: rgb(174, 177, 135);
        `}

        ${props => props.cellNum === 1 && props.covered && css`
            background-color: rgb(132, 121, 78);
        `}  
    }
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
                    cellNum={(x + y) % 2}
                    cell={cell}
                />
            ))}
        </CanvasRowBlock>
    )
}, (prevProps, nextProps) => {
    return prevProps.row === nextProps.row;
});

const CanvasCell = React.memo(({ cell, onClick, cellNum, pieceConverter }) => {
    // console.dir('Canvas Cell')
    return (
        <CanvasCellBlock
            onClick={onClick}
            cellNum={cellNum}
            {...cell}
        >
            {pieceConverter({
                piece: cell.piece,
                owner: cell.owner,
                covered: cell.covered,
                cellNum,
            })}
        </CanvasCellBlock>
    )
}, (prevProps, nextProps) => {
    return prevProps.cell === nextProps.cell;
});

const CanvasContentBlock = styled.div``;

const CanvasContent = ({ board, turn, onClick }) => {
    //  can't memoization
    const onClickCell = useCallback(({y, x}) => {
        onClick(y, x);
    }, [onClick]);

    // console.dir('-----------------------------------------------');

    return  (
        <CanvasContentBlock>
            {board.map((row, y) => (
                <CanvasRow
                    key={`row_${y}`}
                    row={row}
                    y={y}
                    onClickCell={onClickCell}
                    pieceConverter={pieceConverter}
                />
            ))}
        </ CanvasContentBlock>
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