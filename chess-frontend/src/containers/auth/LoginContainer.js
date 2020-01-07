import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { loginThunk, changeField, clearField } from '../../modules/auth';
import AuthForm from '../../components/auth/AuthForm';

const LoginContainer = ({ history }) => {
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

    useEffect(() => {
        if(auth) {
            history.push('/');
        }
    }, [history, auth]);

    useEffect(() => {
        return () => {
            dispatch(clearField({ form: 'login' }));
        }
    }, [dispatch]);
    
    return (
        <AuthForm
            login
            onSubmit={onSubmit}
            onChange={onChange}
            form={form}
        />
    )
};

export default withRouter(LoginContainer);