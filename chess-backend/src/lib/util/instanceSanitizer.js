const instanceSanitizer = instance => {
    return Object.keys(instance)
    .filter(key => key.substring(0, 1) !== '_')
    .reduce((acc, cur) => {
        return {
            ...acc,
            [cur]: instance[cur],
        }
    }, {});
};

export default instanceSanitizer;