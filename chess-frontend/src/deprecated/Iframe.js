import React from 'react';
import styled, { css } from 'styled-components';
import Spinner from '../../static/image/spinner.svg';

const IframeCoverBlock = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 10px;
    box-sizing: border-box;
    background: rgba(255,255,255,0.5);
    width: 236px;
    height: 300px;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
    z-index: -10;
`;

const IframeFrameBlock = styled.div`
    width: 216px;
    height: 280px;
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

    ${props => props.open && css`
        display: none;
    `};
`;

const IframeImageBlock = styled.img`
    width: 50px;
    height: 50px;
`;

const IframeBlock = styled.iframe`
    width: 100%;
    height: 100%;
    border: none;
    /* box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12); */
    z-index: 10;
    visibility: hidden;
    opacity: 0;
    transition: 2s;

    ${props => props.open && css`
        visibility: visible;
        opacity: 1;
    `}
`;

const Iframe = ({ roomKey, open }) => {
    // const src = `https://chesssup.com/billBoard/${roomKey}`;
    const src = `./billBoard/${roomKey}`;

    return (
        <IframeCoverBlock>
            <IframeImageFrameBlock open={open}>
                <IframeImageBlock src={Spinner} />
            </IframeImageFrameBlock>
            <IframeFrameBlock>
                <IframeBlock
                    open={open}
                    src={src}
                />
            </IframeFrameBlock>
        </IframeCoverBlock>
    )
};

export default Iframe;