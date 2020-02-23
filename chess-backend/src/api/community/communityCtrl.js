export const createPost = (req, res, next) => {
    const auth = req.user ? true : false;
    if(!auth) {
        console.dir(`Login is required to write`);
        return res.status(403).send({ error: `Login is required to write` });
    }

    console.dir(auth);

    const { title, content } = req.body;
    console.dir(title);
    console.dir(content);

    return res.status(200).end();
}