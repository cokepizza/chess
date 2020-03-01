import React, { useState, useEffect } from 'react';
import Iframe from './Iframe';

const IframeContainer = ({ roomKey }) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setOpen(true);
        }, 1500);
    }, []);
    
    return (
        <Iframe
            open={open}
            roomKey={roomKey}
        />
    );
};

export default IframeContainer;