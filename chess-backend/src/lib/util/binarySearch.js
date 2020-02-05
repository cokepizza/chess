import { compare } from '../../cache';

const binarySearch = (s, e, list, user) => {
    if(s > e) return -1;
    const m = parseInt((s + e) / 2);
    
    if(list[m].username === user.username) {
        return m;
    }
    
    if(compare(user, list[m]) > 0) {
        return binarySearch(m+1, e, list, user);
    } else {
        return binarySearch(s, m-1, list, user);
    }
};

export default binarySearch;