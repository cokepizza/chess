import React, { useCallback } from 'react';
import AuthForm from '../../components/auth/AuthForm';

const RegisterContainer = () => {
    const onSubmit = useCallback(e => {
        e.preventDefault();
        
    }, []);

    return (
        <AuthForm 
            register
            onSubmit={onSubmit}
        />
    )
};

export default RegisterContainer;