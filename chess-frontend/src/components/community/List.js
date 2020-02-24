import React from 'react';
import styled from 'styled-components';

const ListBlock = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
`;

const PostCompressionBlock = styled.div`
    display: flex;
    width: 80%;
    height: 30px;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
    border: 1px solid black;

    &+& {
        margin-top: 10px;
    }
`;

const TitleBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 30%;
`;

const ContentBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 30%;
`;

const UserBlock = styled.div`
    height: 100%;
    width: 40%;
`;

const PostCompression = ({ post }) => {
    return (
        <PostCompressionBlock>
            <TitleBlock>
                {post.title}
            </TitleBlock>
            <ContentBlock>
                {post.content}
            </ContentBlock>
            <UserBlock>
                {post.user.username}
            </UserBlock>
        </PostCompressionBlock>
    )
}

const List = ({ list }) => {

    return (
        <ListBlock>
            {list && list.posts.map(post => (
                <PostCompression post={post} />
            ))}
        </ListBlock>
    );
};

export default List;