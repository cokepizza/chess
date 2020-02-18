import React from 'react';
import { useSelector } from 'react-redux';
import Write from '../../components/community/Write';


const WriteLayoutContainer = () => {
    const { write } = useSelector(({ community }) => ({
        write: community.write,
    }));

    return (
        <Write
            write={write}
        />
    )
};

export default WriteLayoutContainer;