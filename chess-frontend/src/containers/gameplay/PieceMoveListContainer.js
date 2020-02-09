import React, { useCallback, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PieceMoveList from '../../components/gameplay/PieceMoveList';
import { replayValueThunk } from '../../modules/canvas';

const PieceMoveListContainer = () => {
    
    const dispatch = useDispatch();

    const { pieceMove, showIndex } = useSelector(({ record }) => ({
        pieceMove: record.pieceMove,
        showIndex: record.showIndex,
    }));

    const listRef = useRef();
    
    useEffect(() => {
        if(showIndex >= 0) {
            if(listRef.current.scrollTop > showIndex * 30) {
                listRef.current.scrollTop = showIndex * 30;
            }
            if(showIndex * 30 > listRef.current.scrollTop + 210) {
                listRef.current.scrollTop = showIndex * 30 - 210;
            }
        } else {
            listRef.current.scrollTop = 0;
        }
    }, [pieceMove, showIndex]);

    const onClick = useCallback(index => {
        dispatch(replayValueThunk({ index }));
    }, [dispatch]);

    return (
        <PieceMoveList
            onClick = {onClick}
            pieceMove={pieceMove}
            showIndex={showIndex}
            listRef={listRef}
        />
    )
};

export default PieceMoveListContainer;