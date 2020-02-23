import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Quill from 'quill';
import { setForm, createPostThunk } from '../../modules/community';

import Write from '../../components/community/Write';

const WriteLayoutContainer = () => {
    const { write } = useSelector(({ community }) => ({
        write: community.write,
    }));

    const dispatch = useDispatch();

    const quillElement = useRef();
    const quillInstance = useRef();

    const [ holding, setHolding ] = useState(true);

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

    const onSubmit = useCallback(() => {
        dispatch(createPostThunk({
            title: write.title,
            content: write.content,
        }));
    }, [write]);

    const onCancel = useCallback(() => {

    }, []);

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