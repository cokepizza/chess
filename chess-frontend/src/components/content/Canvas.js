import React, {useCallback} from 'react';
import styled, { css } from 'styled-components';
import { IconContext } from 'react-icons';
import { GiChessPawn, GiChessKing, GiChessQueen, GiChessBishop, GiChessKnight, GiChessRook } from 'react-icons/gi';

const pieceMapper = {
    'pawn': GiChessPawn,
    'king': GiChessKing,
    'queen': GiChessQueen,
    'bishop': GiChessBishop,
    'knight': GiChessKnight,
    'rook': GiChessRook,
}

const playerMapper = {
    'white': {
        color: 'white',
        style: {
            width: '70%',
            height: '70%',
        }
    },
    'black': {
        color: 'black',
        style: {
            width: '70%',
            height: '70%',
        }
    }
}

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
    console.dir('Canvas Row');
    return (
        <CanvasRowBlock>
            {row.map((cell, x) => (
                <CanvasCell
                    key={`cell+${y}_${x}`}
                    onClick={onClickCell.bind(null, {y, x})}
                    covered={cell.covered}
                    cellnum={(x + y) % 2}
                >
                    {pieceConverter({
                        piece: cell.piece,
                        owner: cell.owner
                    })}
                </CanvasCell>
            ))}
        </CanvasRowBlock>
    )
}, (prevProps, nextProps) => {
    Object.entries(prevProps).forEach(([key, value]) => {
        if(prevProps[key] !== nextProps[key]) {
            console.dir(key);
            console.dir(value);
        }
    })
});

const CanvasCell = React.memo(props => {
    console.dir('Canvas Cell')
    return (
        <CanvasCellBlock {...props} />
    )
});

const CanvasContent = ({ board, onClick }) => {
    const onClickCell = useCallback(({ y, x }, pp) => {
        console.dir(pp);
        onClick(y, x);
    }, [onClick]);

    const pieceConverter = useCallback(({piece, owner}) => {
        if(!piece || !owner) {
            return null;
        }
        const Component = pieceMapper[piece];
    
        return (
            <IconContext.Provider  value={playerMapper[owner]}>
                <Component />
            </IconContext.Provider>
        )
    }, []);

    const genBoard = board.map((rowState, y) => (
        <CanvasRowBlock
            key={`row_${y}`}
        >
            {rowState.map((cell, x) => { console.dir('cell rerender'); return (
                <CanvasCell
                    key={`cell_${y}_${x}`}
                    onClick={onClickCell.bind(null, {y, x}, 3)}
                    covered={cell.covered}
                    cellnum={(x + y) % 2}
                >
                    {pieceConverter({
                        piece: cell.piece,
                        owner: cell.owner
                    })}
                </CanvasCell>
            )})
            }
        </CanvasRowBlock>
    ))

    const gen = useCallback(board => board.map((row, y) => (
        <CanvasRow
            key={`row_${y}`}
            row={row}
            y={y}
            onClickCell={onClickCell}
            pieceConverter={pieceConverter}
        />
    )), [onClickCell, pieceConverter]);
    console.dir(gen);

    return  (
        <>
            {gen(board)}
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

// <IconContext.Provider  value={{ size:'50', color: "black"}}>
//     <GiChessBishop />
// </IconContext.Provider>

// board.map((rowState, y) => (
//     <CanvasRowBlock
//         key={`row+${y}`}
//     >
//         {rowState.map((cell, x) => (
//             <CanvasCellBlock
//                 key={`cell+${x}`}
//                 onClick={e => onClick(e, y, x)}
//                 covered={cell.covered}
//                 owner={cell.owner}
//                 cellnum={(x + y) % 2}
//             >
                
                
//                 {cell.piece ? cell.piece : null}
//             </CanvasCellBlock>
//         ))
//         }
//     </CanvasRowBlock>
// ))