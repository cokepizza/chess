import User from './models/user';

const cache = async () => {
    const users = await User.find();
    const sortedUsers = users 
        .map(user => user.serialize())
        .map(user => ({ 
            ...user,
            ratio: (user.win === 0
                ? 0
                : (user.lose === 0 
                        ? 100
                        : user.win / user.lose
                    )
            ).toFixed(2)}))
        .sort((a, b) => {
            if(a.elo === b.elo) {
                if(a.ratio === b.ratio) {
                    if(a.win === b.win) {
                        //  test 필요 숫자로 바꿔서 비교해줘야함
                        return b.createdAt - a.createdAt;
                    } else {
                        return b.win - a.win;
                    }
                } else {
                    return b.ratio - a.ratio;
                }
            } else {
                return b.elo - a.elo;
            }
        });
    

    const data = {
        ranking: {
            limit: 15,
            list: sortedUsers,
        },
    }
    
    return data;
};

export default cache;