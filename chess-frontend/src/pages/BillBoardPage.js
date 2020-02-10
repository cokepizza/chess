import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import BillBoardCanvasWrapperContainer from '../containers/billBoard/BillBoardCanvasWrapperContainer';

const BillBoardPage = ({ history, match }) => {
    useEffect(() => {
        if(!match.params.id) {
            history.push('/');
        }
    }, [history, match]);

    if(!match.params.id) return null;
    const { id } = match.params;
    if(!id) return null;

    return (
        <BillBoardCanvasWrapperContainer roomKey={id}/>
    )
};

export default withRouter(BillBoardPage);