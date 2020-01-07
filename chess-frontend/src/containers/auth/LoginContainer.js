import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginThunk, changeField } from '../../modules/auth';
import AuthForm from '../../components/auth/AuthForm';

const LoginContainer = () => {
    const { form, auth, authError } = useSelector(({ auth }) => ({
        form: auth.login,
        auth: auth.auth,
        authError: auth.authError,
    }));

    const dispatch = useDispatch();

    const onChange = useCallback(e => {
        const { name, value } = e.target;
        dispatch(changeField({
            form: 'login',
            key: name,
            value,
        }));
    }, [dispatch]);

    const onSubmit = useCallback(e => {
        e.preventDefault();

        const { username, password } = form;
        dispatch(loginThunk({ username, password }));
    }, [dispatch, form]);
    
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