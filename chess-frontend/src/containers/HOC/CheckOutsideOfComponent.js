import { useState, useCallback, useRef, useEffect } from 'react';

const CheckOutsideOfComponent = (initialState) => {
    const [componentState, setComponentState] = useState(initialState);
    const ref = useRef(null);

    const checkClickOutside = useCallback(e => {
        if(ref.current && !ref.current.contains(e.target)) {
            setComponentState(false);
        }
    }, []);

    //  not Capturing, use Bubbling(Default)
    useEffect(() => {
        document.addEventListener('click', checkClickOutside);
        return () => {
            document.removeEventListener('click', checkClickOutside);
        }
    }, [checkClickOutside]);

    return { ref, componentState, setComponentState };
}

export default CheckOutsideOfComponent;