import React from 'react';
import { useSelector } from 'react-redux';
import BillBoard from '../../components/billBoard/BillBoard';

const BillBoardContainer = ({ roomKey }) => {
    const { inform } = useSelector(({ billBoard }) => ({
        inform: billBoard.informs[roomKey],
    }));

    return (
        <BillBoard
            roomKey={roomKey}
            inform={inform}
        />
    )
};

export default BillBoardContainer;