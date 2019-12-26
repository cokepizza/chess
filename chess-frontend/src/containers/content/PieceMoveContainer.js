import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PieceMove from '../../components/content/PieceMove';

const PieceMoveContainer = () => {
    
    const dispatch = useDispatch();

    const { pieceMove } = useSelector(({ record }) => ({
        pieceMove: record.pieceMove,
    }));

    const onClickBlock = useCallback(() => {

    }, []);

    const moves = pieceMove.map(obj => {
        console.dir(obj);
        return 'a';
    });

    return (
        <PieceMove
            onClickBlock = {onClickBlock}
            moves={moves}
        />
    )
};

export default PieceMoveContainer;