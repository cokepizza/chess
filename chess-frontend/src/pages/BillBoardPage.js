import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import BillBoardContainer from '../containers/billBoard/BillBoardContainer';

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
        <BillBoardContainer roomKey={id}/>
    )
};

export default withRouter(BillBoardPage);