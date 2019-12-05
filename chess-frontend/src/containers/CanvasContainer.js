import React, { useCallback } from 'react';
import Canvas from '../components/canvas/Canvas';
import { useSelector, useDispatch } from 'react-redux';
import { clickPiece } from '../modules/canvas';

const CanvasContainer = () => {
    const { board } = useSelector(({ canvas }) => ({
        board: canvas.board
    }));

    const dispatch = useDispatch();
    
    const onClick = useCallback((e, cell, y, x) => {
        dispatch(clickPiece({board, cell, y, x, turn: 1}));
        // console.dir(cell);
        // console.dir(y);
        // console.dir(x);
    }, [dispatch, board]);

    return (
        <Canvas
            board={board}
            onClick={onClick}
        />
    )
};

export default CanvasContainer;