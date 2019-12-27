import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PieceMoveList from '../../components/content/PieceMoveList';

const PieceMoveListContainer = () => {
    
    const dispatch = useDispatch();

    const { pieceMove } = useSelector(({ record }) => ({
        pieceMove: record.pieceMove,
    }));

    const onClickBlock = useCallback(() => {

    }, []);

    return (
        <PieceMoveList
            onClickBlock = {onClickBlock}
            pieceMove={pieceMove}
        />
    )
};

export default PieceMoveListContainer;