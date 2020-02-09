import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PieceMoveList from '../../components/gameplay/PieceMoveList';
import { replayValueThunk } from '../../modules/canvas';

const PieceMoveListContainer = () => {
    
    const dispatch = useDispatch();

    const { pieceMove } = useSelector(({ record }) => ({
        pieceMove: record.pieceMove,
    }));

    const onClickBlock = useCallback(index => {
        dispatch(replayValueThunk({ index }));
    }, [dispatch]);

    return (
        <PieceMoveList
            onClickBlock = {onClickBlock}
            pieceMove={pieceMove}
        />
    )
};

export default PieceMoveListContainer;