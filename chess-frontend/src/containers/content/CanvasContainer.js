import React, { useCallback, useEffect } from 'react';
import Canvas from '../../components/content/Canvas';
import { useSelector, useDispatch } from 'react-redux';
import { clickPieceThunk, initializeBlocked } from '../../modules/canvas';

const CanvasContainer = () => {
    const { board, blocked, status, tempAuth } = useSelector(({ canvas, auth, game }) => ({
        board: canvas.board,
        blocked: canvas.blocked,
        status: game.status,
        tempAuth: auth.tempAuth,
    }));

    const dispatch = useDispatch();
    
    useEffect(() => {
        if(tempAuth && status) {
            console.dir(status.turn);
            if((tempAuth.role === 'white' && status.turn % 2 === 0) || (tempAuth.role === 'black' && status.turn % 2 === 1)) {
                dispatch(initializeBlocked({ blocked: false }));
            } else {
                dispatch(initializeBlocked({ blocked: true }));
            }
        }
    }, [dispatch, status, tempAuth]);
    
    //  function은 생성 당시의 Context를 가지고 있기 때문에 redux state값이 제대로 반영되지 않는다
    //  생성되었던 event handler가 React dom에 붙어있기 때문에 dom이 rerender되지 않는 이상
    //  오래된 state를 가지고 있을 수 밖에 없다. 따라서 ref를 통해 참조값을 가지고 있거나
    //  혹은 redux state라면 이 코드와 같이 thunk를 사용하는 방법이 있다

    const onClick = useCallback((y, x) => {
        dispatch(clickPieceThunk({ y, x }));
    }, [dispatch]);

    return (
        <Canvas
            board={board}
            blocked={blocked}
            onClick={onClick}
        />
    )
};

export default CanvasContainer;