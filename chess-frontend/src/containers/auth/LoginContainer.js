import React, { useCallback } from 'react';
import AuthForm from '../../components/auth/AuthForm';

const LoginContainer = () => {

    const onSubmit = useCallback(e => {
        e.preventDefault();
        alert('jaja');
    }, []);

    return (
        <AuthForm
            login
            onSubmit={onSubmit}
        />
    )
};

export default LoginContainer;