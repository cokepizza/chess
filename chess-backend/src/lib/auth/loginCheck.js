const loginCheck = (req, res, next) => {
    if(!req.user) {
        console.dir(`Login required to use this service`);
        return res.status(403).send({ error: `Login required to use this service` });
    }

    return next();
};

export default loginCheck;