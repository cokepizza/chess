import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Quill from 'quill';

import Write from '../../components/community/Write';
import { setForm, createPostThunk, updatePostThunk, clearFormAll, setStatus } from '../../modules/community';

const WriteLayoutContainer = () => {
    const { write, menu } = useSelector(({ community }) => ({
        write: community.write,
        menu: community.menu,
    }));

    const dispatch = useDispatch();

    const quillElement = useRef();
    const quillInstance = useRef();
    const mounted = useRef(false);

    const [ holding, setHolding ] = useState(!(write && write.title));

    useEffect(() => {
        quillInstance.current = new Quill(quillElement.current, {
            theme: 'bubble',
            placeholder: 'content',
            modules: {
                toolbar: [
                    [{ header: '1' }, { header: '2' }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['blockquote', 'code-block', 'link', 'image'],
                ]
            },
        });

        const quill = quillInstance.current;
        quill.on('text-change', (delta, oldDelta, source) => {
            if(source === 'user') {
                dispatch(setForm({
                    status: 'write',
                    key: 'content',
                    value: quill.root.innerHTML,
                }))
            }
        });
    }, [dispatch]);

    useEffect(() => {
        if(mounted.current) return;
        mounted.current = true;
        quillInstance.current.root.innerHTML = write.content;
    }, [write]);

    useEffect(() => {
        return () => {
            dispatch(clearFormAll({
                status: 'write',
            }));
        }
    }, [dispatch]);

    const onChangeTitle = useCallback(e => {
        if(holding && e.target.value !== '') {
            setHolding(false);
        } else if(!holding && e.target.value === ''){
            setHolding(true);
        }
        
        dispatch(setForm({
            status: 'write',
            key: 'title',
            value: e.target.value,
        }));
    }, [dispatch, holding]);

    const onSubmit = useCallback(async() => {
        const criteria = menu.find(criteria => criteria.checked);

        if(!write.modify) {
            //  create
            await dispatch(createPostThunk({
                kind: criteria.name,
                title: write.title,
                content: write.content,
            }));
        } else {
            //  update
            await dispatch(updatePostThunk({
                id: write.modify,
                kind: criteria.name,
                title: write.title,
                content: write.content,
            }));
        }

        dispatch(setStatus({
            status: 'list',
        }));
    }, [dispatch, write, menu]);

    const onCancel = useCallback(() => {
        dispatch(setStatus({
            status: 'list',
        }));
    }, [dispatch]);

    return (
        <Write
            quillElement={quillElement}
            onChangeTitle={onChangeTitle}
            write={write}
            holding={holding}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    )
};

export default WriteLayoutContainer;