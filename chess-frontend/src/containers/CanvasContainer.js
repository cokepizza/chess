import React, { useCallback } from 'react';
import Canvas from '../components/canvas/Canvas';
import { useSelector, useDispatch } from 'react-redux';

const CanvasContainer = () => {
    const { board } = useSelector(({ canvas }) => ({
        board: canvas.board
    }));
    
    const onClick = useCallback((e, cell, y, x) => {
        console.dir(cell);
        console.dir(y);
        console.dir(x);
    }, []);

    return (
        <Canvas
            board={board}
            onClick={onClick}
        />
    )
};

export default CanvasContainer;