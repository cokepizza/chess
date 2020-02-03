import { compare } from '../../cache';

const binarySearch = (s, e, list, user) => {
    const m = parseInt((s + e) / 2);
    
    console.dir(list);
    console.dir(user);
    console.dir(list[m]);
    
    if(compare(list[m], user) > 0) {
        return binarySearch(m, e, list, user);
    } else {
        return binarySearch(s, m, list, user);
    }
};

export default binarySearch;