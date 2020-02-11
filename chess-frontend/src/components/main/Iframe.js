import React from 'react';
import styled from 'styled-components';

const IframeBlock = styled.iframe`
    width: 300px;
    height: 300px;
    background-color: pink;
`;

const Iframe = ({ roomKey }) => {
    const src = `https://cokepizza/billBoard/${roomKey}`
    return (
        <IframeBlock
            src={src}
        />
    )
};

export default Iframe;