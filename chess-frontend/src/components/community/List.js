import React from 'react';
import styled from 'styled-components';
import { GoPin } from 'react-icons/go';
import { IconContext } from 'react-icons';

import PaginationContainer from '../../containers/community/PaginationContainer';

const ListBlock = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    padding-top: 5px;
    width: 100%;
    height: 100%;
`;

const PostNoticeBlock = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 90%;
    height: 30px;
    background: rgba(102, 204, 255, 0.1);
    cursor: pointer;
    box-sizing: border-box;
    padding: 0px 20px;
    margin-bottom: 5px;
    /* border: 1px solid rgba(0, 0, 0, 0.2); */
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const TextBlock = styled.div`
    margin-left: 10px;
    font-size: 12px;
`;

const PostWrapper = styled.div`
    /* border: 1px solid #eee; */
    width: 90%;
    height: 479px;
    box-sizing: border-box;
    /* border: 1px solid rgba(0, 0, 0, 0.2); */
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const PostCompressionBlock = styled.div`
    display: flex;
    width: 100%;
    height: 31px;
    background: white;
    cursor: pointer;

    &+& {
        border-top: 1px solid rgba(0, 0, 0, 0.2);
    }
    
    &:hover {
        background: rgba(0, 0, 0, 0.01);
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
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 40%;
`;

const PaginationFrameBlock = styled.div`
    margin-top: 5px;
    width: 90%;
    height: 30px;
`;

const PostCompression =  ({ post }) => {
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
            <PostNoticeBlock>
                <IconContext.Provider value={{ style: { width: '20px', height: '20px' } }}>
                    <GoPin />
                </IconContext.Provider>
                <TextBlock>
                    Chesssup ver1 will be released soon.
                </TextBlock>
            </PostNoticeBlock>
            <PostWrapper>
                {list && list.posts.map(post => (
                    <PostCompression
                        key={post._id}
                        post={post}
                    />
                ))}
            </PostWrapper>
            <PaginationFrameBlock>
                <PaginationContainer />
            </PaginationFrameBlock>
        </ListBlock>
    );
};

export default List;