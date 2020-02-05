import User from './models/user';

//  decending order
export const compare = (a, b) => {
    if(a.elo === b.elo) {
        if(a.ratio === b.ratio) {
            if(a.win === b.win) {
                return b.createdAt.getTime() - a.createdAt.getTime();
            } else {
                return b.win - a.win;
            }
        } else {
            return b.ratio - a.ratio;
        }
    } else {
        return b.elo - a.elo;
    }
}

export const getRatio = user => ({ 
    ...user,
    ratio: (user.win === 0
        ? 0
        : ((user.win + user.lose === 0)
                ? 100
                : user.win / (user.win + user.lose)
            )
    ).toFixed(2)
})

const cache = async () => {
    const users = await User.find();
    const sortedUsers = users 
        .map(user => user.serialize())
        .map(getRatio)
        .sort(compare);
    const data = {
        ranking: {
            limit: 15,
            list: sortedUsers,
        },
    }
    
    return data;
};

export default cache;