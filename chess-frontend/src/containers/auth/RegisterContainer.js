import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import AuthForm from '../../components/auth/AuthForm';
import { registerThunk, changeField, clearField } from '../../modules/auth';

const RegisterContainer = ({ history }) => {
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

    useEffect(() => {
        if(auth) {
            history.push('/');
        }
    }, [history, auth])

    useEffect(() => {
        return () => {
            dispatch(clearField({ form: 'register' }));
        };
    }, [dispatch]);

    return (
        <AuthForm 
            register
            onSubmit={onSubmit}
            onChange={onChange}
            form={form}
        />
    )
};

export default withRouter(RegisterContainer);