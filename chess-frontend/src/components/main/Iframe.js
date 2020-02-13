import React from 'react';
import styled from 'styled-components';
import Spinner from '../../static/image/spinner.svg';

const IframeFrameBlock = styled.div`
    width: 216px;
    height: 216px;
    position: relative;
`;

const IframeImageFrameBlock = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const IframeImageBlock = styled.img`
    width: 50px;
    height: 50px;
`;

const IframeBlock = styled.iframe`
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
    z-index: 10;
`;

const Iframe = ({ roomKey }) => {
    const src = `https://chesssup.com/billBoard/${roomKey}`;
    // const src = `./billBoard/${roomKey}`;

    return (
        <IframeFrameBlock>
            <IframeImageFrameBlock>
                <IframeImageBlock src={Spinner} />
            </IframeImageFrameBlock>
            <IframeBlock src={src} />
        </IframeFrameBlock>
    )
};

export default Iframe;