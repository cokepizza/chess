import React from 'react';
import 'quill/dist/quill.bubble.css';

import styled from 'styled-components';

const QuillFrameBlock = styled.div`
    width: 90%;
    height: 80%;
    background: white;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const QuillWrapperBlock = styled.div``;

const WriteBlock = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
`;

const TitleInputBlock = styled.input`
    width: 90%;
    height: 30px;
    font-size: 12px;
    
    padding-left: 10px;
    padding-right: 10px;
    box-sizing: border-box;
    border: none;
    outline: none;
    margin-bottom: 5px;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const Write = ({ quillElement, onChangeTitle, write }) => {
    return (
        <WriteBlock>
            <TitleInputBlock
                onChange={onChangeTitle}
                value={write.title}
            />
            <QuillFrameBlock>
                <QuillWrapperBlock ref={quillElement} />
            </QuillFrameBlock>
        </WriteBlock>
    );
};

export default Write;