import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Joi from 'joi';
import { loginThunk, changeField, clearField } from '../../modules/auth';
import AuthForm from '../../components/auth/AuthForm';

const LoginContainer = ({ history }) => {
    const { form, auth, authError } = useSelector(({ auth }) => ({
        form: auth.login,
        auth: auth.auth,
        authError: auth.authError,
    }));

    const dispatch = useDispatch();

    const [ blink, setBlink ] = useState({
        username: false,
        password: false,
        count: 0,
    });

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

        //  initialize
        let invalid = Object.keys(form)
            .reduce((acc, key) =>
                ({
                    ...acc,
                    [key]: false,
                }),{});

        //  empty check
        Object.keys(invalid)
            .filter(key => form[key] === '')
            .forEach(key => {
                console.dir(key);
                invalid[key] = true;
            });

        const schema = Joi.object().keys({
            username: Joi.string().max(80).email({ minDomainAtoms: 2 }).required(),
            password: Joi.string().min(4).max(16).required(),
        });

        const result = Joi.validate(form, schema, { abortEarly: false });

        if(result.error) {
            result.error.details.forEach(detail => {
                invalid = {
                    ...invalid,
                    [detail.path[0]]: true,
                }
            });
        }

        if(Object.keys(invalid).filter(key => invalid[key]).length > 0) {
            setBlink(prevState => ({
                ...prevState,
                ...invalid,
                count: prevState.count + 1,
            }));
            return;
        };

        dispatch(loginThunk({ username, password }));
    }, [dispatch, form]);

    useEffect(() => {
        if(authError) {
            console.dir('Login failed');
            console.dir(authError);
            
            return;
        };

        if(auth) {
            history.push('/');
        }
    }, [history, auth, authError]);

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
            blink={blink}
        />
    )
};

export default withRouter(LoginContainer);