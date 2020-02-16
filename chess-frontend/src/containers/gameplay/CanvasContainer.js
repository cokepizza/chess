import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Canvas from '../../components/gameplay/Canvas';
import { clickPieceThunk, initializeBlocked , clearClickedThunk } from '../../modules/canvas';
import { clearValue } from '../../modules/canvas';
import defaultBoard from '../../lib/base/board';

const CanvasContainer = ({ cellSize, glanceAt }) => {
    const { board, reverseBoard, blocked, reversed, replayMode, turn, role } = useSelector(({ canvas, socketAuth, game, record }) => ({
        board: canvas.board,
        reverseBoard: canvas.reverseBoard,
        blocked: canvas.blocked,
        reversed: record.reversed,
        replayMode: record.replayMode,
        turn: game.turn,
        role: socketAuth.role,
    }));

    const dispatch = useDispatch();

    const [init, setInit] = useState(false);

    useEffect(() => {
        if((role && !init) || (glanceAt && !init)) {
            setInit(true);
        }
    }, [init, role, glanceAt]);
    
    useEffect(() => {
        if(!replayMode) {
            // if((role === 'white' && turn % 2 === 0) || (role === 'black' && turn % 2 === 1)) {
            if(((role === 'white' || role === 'spectator') && turn % 2 === 0) || (role === 'black' && turn % 2 === 1)) {
                dispatch(initializeBlocked({ blocked: false }));
            } else {
                dispatch(initializeBlocked({ blocked: true }));
            }
        }
    }, [dispatch, turn, role, replayMode]);
    
    useEffect(() => {
        return () => {
            dispatch(clearValue());
        }
    }, [dispatch])

    //  function은 생성 당시의 Context를 가지고 있기 때문에 redux state값이 제대로 반영되지 않는다
    //  생성되었던 event handler가 React dom에 붙어있기 때문에 dom이 rerender되지 않는 이상
    //  오래된 state를 가지고 있을 수 밖에 없다. 따라서 ref를 통해 참조값을 가지고 있거나
    //  혹은 redux state라면 이 코드와 같이 thunk를 사용하는 방법이 있다

    const onClick = useCallback((y, x) => {
        dispatch(clickPieceThunk({ y, x }));
    }, [dispatch]);

    const onContextMenu = useCallback(e => {
        e.preventDefault();
        dispatch(clearClickedThunk());
    }, [dispatch])

    let reversal = false;
    if(((role === 'white' || role === 'spectator') && reversed) || (role === 'black' && !reversed)) {
        reversal = true;
    }

    let servedBoard = board;
    if(reversal) {
        servedBoard = reverseBoard;
    };

    if(!init) {
        servedBoard = [ ...defaultBoard ];
    }

    return (
        <Canvas
            board={servedBoard}
            blocked={blocked}
            onClick={onClick}
            onContextMenu={onContextMenu}
            cellSize={cellSize}
            replayMode={replayMode}
        />
    )    
};

export default CanvasContainer;