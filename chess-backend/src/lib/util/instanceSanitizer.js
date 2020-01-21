const instanceSanitizer = instance => {
    if(Array.isArray(instance)) {
        return instance.map(ins => instanceSanitizer(ins));
    }

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