import React from 'react';

import BillBoard from '../../components/billBoard/BillBoard';

const BillBoardContainer = ({ roomKey }) => {
    return (
        <BillBoard roomKey={roomKey}/>
    )
};

export default BillBoardContainer;