import ColorHash from 'color-hash';

let counter = 0;

/* SocketIO 연결 전, 첫 세션 생성 시점 */
export const getSession = (req, res, next) => {
    if(!req.session.role) {
        ++counter;
        if(counter === 1) {
            req.session.role = 'black';
        } else if(counter === 2) {
            req.session.role = 'white';
        } else {
            req.session.role = 'spectator';
        }
        const colorHash = new ColorHash();
        req.session.color = colorHash.hex(req.sessionID);
    }
    
    req.session.save();
    console.dir('----------http(getSession)---------')
    console.dir(req.sessionID);
    res.status(202).end();
}