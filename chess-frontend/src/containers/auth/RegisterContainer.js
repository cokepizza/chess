import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AuthForm from '../../components/auth/AuthForm';
import { registerThunk, changeField } from '../../modules/auth';

const RegisterContainer = () => {
    const { form, auth, authError } = useSelector(({ auth }) => ({
        form: auth.register,
        auth: auth.auth,
        authError: auth.authError,
    }));

    const dispatch = useDispatch();

    const onChange = useCallback(e => {
        const { name, value } = e.target;
        dispatch(changeField({
            form: 'register',
            key: name,
            value,
        }));
    }, [dispatch]);

    const onSubmit = useCallback(e => {
        e.preventDefault();
        const { username, password } = form;

        dispatch(registerThunk({ username, password }));
    }, [dispatch, form]);

    return (
        <AuthForm 
            register
            onSubmit={onSubmit}
            onChange={onChange}
            form={form}
        />
    )
};

export default RegisterContainer;