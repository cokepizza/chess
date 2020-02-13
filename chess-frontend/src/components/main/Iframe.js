import React from 'react';
import styled from 'styled-components';

const IframeBlock = styled.iframe`
    width: 216px;
    height: 216px;
    background-color: pink;
    border: none;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const Iframe = ({ roomKey }) => {
    const src = `https://chesssup.com/billBoard/${roomKey}`;
    // const src = `./billBoard/${roomKey}`;

    return (
        <IframeBlock
            src={src}
        />
    )
};

export default Iframe;