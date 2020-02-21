import React, { useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Quill from 'quill';
import { setForm } from '../../modules/community';

import Write from '../../components/community/Write';

const WriteLayoutContainer = () => {
    const { write } = useSelector(({ community }) => ({
        write: community.write,
    }));

    const dispatch = useDispatch();

    const quillElement = useRef();
    const quillInstance = useRef();

    useEffect(() => {
        quillInstance.current = new Quill(quillElement.current, {
            theme: 'bubble',
            placeholder: '...write',
            modules: {
                toolbar: [
                    [{ header: '1' }, { header: '2' }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['blockquote', 'code-block', 'link', 'image'],
                ]
            },
        });

        quillInstance.current.on('text-change', (delta, oldDelta, source) => {
            console.dir(source);
            if(source === 'user') {
                console.dir(quillInstance.current.root.innerHTML);
            }
        });
    }, []);

    const onChangeTitle = useCallback(e => {
        dispatch(setForm({
            status: 'write',
            key: 'title',
            value: e.target.value,
        }));
    }, [dispatch]);

    return (
        <Write
            quillElement={quillElement}
            onChangeTitle={onChangeTitle}
            write={write}
        />
    )
};

export default WriteLayoutContainer;