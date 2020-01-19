import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/common/Header';
import { logoutProcessThunk, clearField } from '../../modules/sessionAuth';
import { connectWebsocket, disconnectWebsocket } from '../../modules/sessionAuth';
import { withRouter } from 'react-router-dom';

const HeaderContainer = ({ history }) => {
    const { tempAuth, auth } = useSelector(({ sessionAuth }) => ({
        tempAuth: sessionAuth.tempAuth,
        auth: sessionAuth.auth,
    }));
    const dispatch = useDispatch();

    const onLogout = useCallback(() => {
        dispatch(logoutProcessThunk());
    }, [dispatch]);
    
    const onRecord = useCallback(() => {
        alert('onRecord');
    }, []);
    
    //  link 태그로 단순히 넘어갈 경우 dispatch전에 라우팅이 먼저 넘어가기 때문에
    //  onClick으로 받아 dispatch를 마치고 routing이 넘어가도록 변경
    const onLogin = useCallback(() => {
        dispatch(clearField({ form: 'login' }));
        history.push('/login');
    }, [dispatch, history]);

    //  async일 필요 없음, 따로 clearValue는 렌더링을 줄이기 위해 별도로 호출하지 않음
    useEffect(() => {
        dispatch(connectWebsocket());
        return () => {
            dispatch(disconnectWebsocket());
        }
    }, [dispatch]);

    return (
        <Header
            onRecord={onRecord}
            onLogout={onLogout}
            onLogin={onLogin}
            tempAuth={tempAuth}
            auth={auth}
        />
    );
};

export default withRouter(HeaderContainer);