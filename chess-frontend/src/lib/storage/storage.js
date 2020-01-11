export const setLocalStorage = ({ ...rest }) => {
    try {
        Object.keys(rest).forEach(key => {
            localStorage.setItem(key, JSON.stringify(rest[key]));
        })
    } catch(e) {
        console.dir('Set localStorage failed');
        console.dir(e);
    }
}

export const getLocalStorage = key => {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch(e) {
        console.dir('Get localStorage failed');
        console.dir(e);
    }   
}

export const removeLocalStorage = key => {
    try {
        localStorage.removeItem(key);
    } catch(e) {
        console.dir('Remove localStorage failed');
        console.dir(e);
    }
}

export const clearLocalStorage = () => {
    try {
        localStorage.clear();
    } catch(e) {
        console.dir('Clear localStorage failed');
        console.dir(e);
    }   
};