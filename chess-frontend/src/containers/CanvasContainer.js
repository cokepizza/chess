import React, { useCallback } from 'react';
import Canvas from '../components/content/Canvas';
import { useSelector, useDispatch } from 'react-redux';
import { clickPiece } from '../modules/canvas';

const CanvasContainer = () => {
    const { board, clicked } = useSelector(({ canvas }) => ({
        board: canvas.board,
        clicked: canvas.clicked,
    }));

    const dispatch = useDispatch();
    
    const onClick = useCallback((e, y, x) => {
        dispatch(clickPiece({board, clicked, y, x, turn: 1}));
    }, [dispatch, board, clicked]);

    return (
        <Canvas
            board={board}
            onClick={onClick}
        />
    )
};

export default CanvasContainer;