import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import Canvas from '../../components/gameplay/Canvas';

const BillBoardCanvasWrapperContainer = ({ roomKey, cellSize }) => {
    const { board } = useSelector(({ billBoard }) => ({
        board: billBoard.boards[roomKey],
    }));

    const onContextMenu = useCallback(e => {
        e.preventDefault();
    }, []);

    return (
        <Canvas
            board={board}
            billBoard={true}
            blocked={true}
            onContextMenu={onContextMenu}
            cellSize={cellSize}
        />
    )
};

export default BillBoardCanvasWrapperContainer;