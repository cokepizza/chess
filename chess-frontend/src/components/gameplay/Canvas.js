import React, {useCallback} from 'react';
import styled, { css, createGlobalStyle } from 'styled-components';
import { IconContext } from 'react-icons';
import { pieceMapper, playerMapper } from '../../lib/base/pieceConverter';

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
    position: relative;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
    transition: 0.5s;

    ${props => props.replayMode && css`
        opacity: 0.8;
    `}
`;

const CanvasRowBlock = styled.div`
    display: flex;
`;

const CanvasCellBlock = styled.div`
    display: flex;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    /* width: 90px;
    height: 90px; */
    
    width: ${props => {
        if(props.cellSize) {
            return props.cellSize;
        }
        return '90px';
    }};

    height: ${props => {
        if(props.cellSize) {
            return props.cellSize;
        }
        return '90px';
    }};

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

    ${props => props.cellNum === 0 && props.tracked && css`
        background-color: rgb(205, 210, 106);
    `}

    ${props => props.cellNum === 1 && props.tracked && css`
        background-color: rgb(170, 162, 58);
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

const CanvasRow = React.memo(({ row, y, cellSize, onClickCell, pieceConverter }) => {
    // console.dir('Canvas Row');
    return (
        <CanvasRowBlock>
            {row.map((cell, x) => (
                <CanvasCell
                    key={`cell_${y}_${x}`}
                    onClick={onClickCell.bind(null, {y, x})}
                    pieceConverter={pieceConverter}
                    cellNum={(x + y) % 2}
                    cellSize={cellSize}
                    cell={cell}
                    y={y}
                    x={x}
                />
            ))}
        </CanvasRowBlock>
    )
}, (prevProps, nextProps) => {
    return prevProps.row === nextProps.row;
});

const CanvasCell = React.memo(({ cell, cellSize, cellNum, onClick, pieceConverter, y, x }) => {
    // console.dir(`Canvas Cell ${y}_${x}`);
    return (
        <CanvasCellBlock
            onClick={onClick}
            cellNum={cellNum}
            cellSize={cellSize}
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

const CanvasContentBlock = styled.div`
    ${props => props.blocked && css`
        pointer-events: none;
    `}
`;

const CanvasContent = ({ board, blocked, cellSize, onClick }) => {
    //  can't memoization
    const onClickCell = useCallback(({y, x}) => {
        onClick(y, x);
    }, [onClick]);

    // const rev = board.reverse().map((row, y) => (
    //     <CanvasRow
    //         key={`row_${y}`}
    //         row={row.reverse()}
    //         y={y}
    //         cellSize={cellSize}
    //         onClickCell={onClickCell}
    //         pieceConverter={pieceConverter}
    //     />
    // ));
    
    return  (
        <CanvasContentBlock blocked={blocked}>
            {board && board.map((row, y) => (
                <CanvasRow
                    key={`row_${y}`}
                    row={row}
                    y={y}
                    cellSize={cellSize}
                    onClickCell={onClickCell}
                    pieceConverter={pieceConverter}
                />
            ))}
        </ CanvasContentBlock>
    )
}

const ReplayBlock = styled.div`
    position: absolute;
    top: 0;
    left: calc(100% + 17px);
    width: 60px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
    font-size: 12px;
    visibility: hidden;
    opacity: 0;
    transition: 0.5s;
    font-weight: bold;

    ${props => props.replayMode && css`
        visibility: visible;
        opacity: 1;
    `}
`;

// //  useless
// const GlobalStyle = createGlobalStyle`
//     body {
//         background: rgba(255,255,255,0.5);
//     }
// `;

const Canvas = ({ onContextMenu, replayMode, billBoard, ...rest }) => {
    return (
        <>
            {/* {billBoard && <GlobalStyle />} */}
            <CanvasBlock
                replayMode={replayMode}
                onContextMenu={onContextMenu}
            >
                <CanvasContent {...rest} />
                <ReplayBlock replayMode={replayMode}>Replay</ReplayBlock>
            </CanvasBlock>
        </>
    )
};

export default React.memo(Canvas);