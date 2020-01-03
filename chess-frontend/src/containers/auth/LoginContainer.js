import React, { useCallback } from 'react';
import AuthForm from '../../components/auth/AuthForm';

const LoginContainer = () => {
    const onSubmit = useCallback(e => {
        e.preventDefault();
        
    }, []);

    return (
        <AuthForm
            login
            onSubmit={onSubmit}
        />
    )
};

export default LoginContainer;