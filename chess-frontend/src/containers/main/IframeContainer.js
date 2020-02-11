import React from 'react';
import Iframe from '../../components/main/Iframe';

const IframeContainer = ({ roomKey }) => {
    return (
        <Iframe roomKey={roomKey} />
    );
};

export default IframeContainer;