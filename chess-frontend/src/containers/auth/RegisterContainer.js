import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Joi from 'joi';
import AuthForm from '../../components/auth/AuthForm';
import { registerThunk, changeField, clearField } from '../../modules/auth';

const RegisterContainer = ({ history }) => {
    const { form, auth, authError } = useSelector(({ auth }) => ({
        form: auth.register,
        auth: auth.auth,
        authError: auth.authError,
    }));

    const dispatch = useDispatch();
    
    const [ blink, setBlink ] = useState({
        username: false,
        password: false,
        passwordConfirm: false,
        count: 0,
    })

    const [ error, setError ] = useState({
        username: 'Email is not valid',
        password: 'Password',
        passwordConfirm: 'Confirm Password'
    })

    const onChange = useCallback(e => {
        const { name, value } = e.target;
        if(error[name] !== '') {
            setError(prevState => ({
                ...prevState,
                [name]: '',
            }));
        }
        dispatch(changeField({
            form: 'register',
            key: name,
            value,
        }));
    }, [dispatch, error]);

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
            passwordConfirm: Joi.any().valid(Joi.ref('password')).required().error(() => ({ message: 'password mismatch' })),
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

        dispatch(registerThunk({ username, password }));
    }, [dispatch, form]);

    useEffect(() => {
        if(auth) {
            console.dir(auth);
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
            blink={blink}
            error={error}
        />
    )
};

export default withRouter(RegisterContainer);