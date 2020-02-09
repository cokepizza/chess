import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import UndoRedo from '../../components/gameplay/UndoRedo';
import { replayValueThunk } from '../../modules/canvas';

const UndoRedoContainer = () => {
    const { pieceMove } = useSelector(({ record }) => ({
        pieceMove: record.pieceMove,
    }));

    const dispatch = useDispatch();
 
    const onFastUndo = useCallback(() => {
        dispatch(replayValueThunk({ index: -1 }));
    }, [dispatch]);

    const onStepUndo = useCallback(() => {
        dispatch(replayValueThunk({ diff: -1 }));
    }, [dispatch]);

    const onStepRedo = useCallback(() => {
        dispatch(replayValueThunk({ diff: +1 }));
    }, [dispatch]);

    const onFastRedo = useCallback(() => {
        dispatch(replayValueThunk({ index: pieceMove.length-1 }));
    }, [dispatch, pieceMove]);

    return (
        <UndoRedo
            onStepUndo={onStepUndo}
            onStepRedo={onStepRedo}
            onFastUndo={onFastUndo}
            onFastRedo={onFastRedo}
        />
    )
};

export default UndoRedoContainer;