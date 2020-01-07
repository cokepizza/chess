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
    })

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
        const { username, password, passwordConfirm } = form;

        const obj = Object.keys(form).filter(key => key === '').reduce((acc, cur) => {
            return {
                ...acc,
                [cur]: true
            }
        }, {});

        console.dir(obj);

            // setBlink(prevState => ({
            //     ...prevState,
            //     username: true
            // }));

        if(password !== passwordConfirm) {

        }

        const schema = Joi.object().keys({
            username: Joi.string().email({ minDomainAtoms: 2 }).required(),
            password: Joi.string().required(),
        });

        const result = Joi.validate(form, schema);
        if(result.error) {
            console.dir(result.error);
            
            return;
        }

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