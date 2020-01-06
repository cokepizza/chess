import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthForm from '../../components/auth/AuthForm';

const LoginContainer = () => {
    const { form, auth, authError } = useSelector(({ auth }) => ({
        form: auth.login,
        auth: auth.auth,
        authError: auth.authError,
    }));

    const dispatch = useDispatch();

    const onChange = e => {

    };

    const onSubmit = useCallback(e => {
        e.preventDefault();
        alert('jaja');
    }, []);

    return (
        <AuthForm
            login
            onSubmit={onSubmit}
            onChange={onChange}
            form={form}
        />
    )
};

export default LoginContainer;