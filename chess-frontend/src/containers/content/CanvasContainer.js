import React, { useCallback } from 'react';
import Canvas from '../../components/content/Canvas';
import { useSelector, useDispatch } from 'react-redux';
import { clickPieceThunk } from '../../modules/canvas';

const CanvasContainer = () => {
    const { board } = useSelector(({ canvas }) => ({
        board: canvas.board
    }));

    const dispatch = useDispatch();
    
    //  function은 생성 당시의 Context를 가지고 있기 때문에 redux state값이 제대로 반영되지 않는다
    //  생성되었던 event handler가 React dom에 붙어있기 때문에 dom이 rerender되지 않는 이상
    //  오래된 state를 가지고 있을 수 밖에 없다. 따라서 ref를 통해 참조값을 가지고 있거나
    //  혹은 redux state라면 이 코드와 같이 thunk를 사용하는 방법이 있다

    const onClick = useCallback((y, x) => {
        dispatch(clickPieceThunk({y, x, turn: 1}));
    }, [dispatch]);

    return (
        <Canvas
            board={board}
            onClick={onClick}
        />
    )
};

export default CanvasContainer;