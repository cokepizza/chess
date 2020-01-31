import { compare } from '../../cache';
const binarySearch = (s, e, list, user) => {
    const m = parseInt((s + e) / 2);
    console.dir(list[m]);
    console.dir(user);
    
    if(compare(list[m], user) > 0) {

    } else {

    }
    return 0;
};

export default binarySearch;