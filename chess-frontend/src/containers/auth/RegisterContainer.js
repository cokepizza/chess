import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Joi from 'joi';
import AuthForm from '../../components/auth/AuthForm';
import { registerProcessThunk, changeField, clearField, clearSpecificField } from '../../modules/sessionAuth';

const RegisterContainer = ({ history }) => {
    const { form, auth, authError } = useSelector(({ sessionAuth }) => ({
        form: sessionAuth.register,
        auth: sessionAuth.auth,
        authError: sessionAuth.authError,
    }));

    const dispatch = useDispatch();

    const [ error, setError ] = useState({
        username: '',
        password: '',
        passwordConfirm: ''
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
         let nextError = Object.keys(form)
         .reduce((acc, key) =>
             ({
                 ...acc,
                 [key]: false,
             }),{});

        //  empty check
        Object.keys(nextError)
            .filter(key => form[key] === '')
            .forEach(key => {
                nextError = {
                    ...nextError,
                    [key]: 'Required field'
                }
            });

        const schema = Joi.object().keys({
            username: Joi.string().max(80).email({ minDomainAtoms: 2 }).required().error(() => ({ message: 'Wrong format' })),
            password: Joi.string().min(4).max(16).required().error(() => ({ message: '4 ~ 16 digits' })),
            passwordConfirm: Joi.any().valid(Joi.ref('password')).required().error(() => ({ message: 'Password mismatch' })),
        });

        const result = Joi.validate(form, schema, { abortEarly: false });

        if(result.error) {
            result.error.details.forEach(detail => {
                if(!nextError[detail.path[0]]) {
                    nextError = {
                        ...nextError,
                        [detail.path[0]]: detail.message,
                    }
                }
            });
        }

        if(Object.keys(nextError).filter(key => nextError[key]).length > 0) {
            setError(prevState => ({
                ...nextError,
                count: prevState.count + 1,
            }));
            Object.keys(nextError).forEach(key => {
                if(nextError[key]) {
                    dispatch(clearSpecificField({ form: 'register', key }))
                }
            });

            return;
        };

        dispatch(registerProcessThunk({ username, password }));
        dispatch(clearField({ form: 'register' }));
    }, [dispatch, form]);

    useEffect(() => {
        if(authError) {
            let nextError = {};
            const errorMention = authError.response.data;
            Object.keys(errorMention).forEach(key => {
                nextError = {
                    ...nextError,
                    [key]: errorMention[key],
                }
                // dispatch(clearSpecificField({ form: 'register', key }))
            });

            setError(nextError);
            
            return;
        }

        if(auth) {
            history.push('/');
        }
    }, [history, auth, authError])

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
            error={error}
        />
    )
};

export default withRouter(RegisterContainer);