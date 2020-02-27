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
    background: white;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const PostCompressionBlock = styled.div`
    display: flex;
    width: 100%;
    height: 31px;
    background: white;
    cursor: pointer;
    font-size: 12px;

    &+& {
        border-top: 1px solid rgba(0, 0, 0, 0.2);
    }

    &:last-child {
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    }

    &:nth-child(15) {
        border-bottom: 0px;
    }
    
    &:hover {
        background: rgba(0, 0, 0, 0.05);
    }
`;

const TitleBlock = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
    width: 300px;
`;

const NumberFrameBlock = styled.div`
    width: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const NumberBlock = styled.div`
    font-size: 10px;
    width: fit-content;
    padding: 2px 5px;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const EllipsisBlock = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
    margin-left: 10px;
`;

const CommentCounter = styled.div`
    font-size: 10px;
    margin-left: 3px;
    height: 30px;
    padding-top: 5px;
    color: rgba(0, 51, 204, 0.5);
`;

const UserBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 200px;
    font-size: 10px;
`;

const DateBlock = styled.div`
    height: 100%;
    width: 200px;
    font-size: 10px;
`;

const PaginationFrameBlock = styled.div`
    margin-top: 5px;
    width: 90%;
    height: 30px;
`;

const PostCompression =  ({ post }) => {
    const createdAt = new Date(Date.parse(post.createdAt));
    const date = createdAt.getFullYear() + " / " + createdAt.getMonth() + " / " + createdAt.getDate();
    return (
        <PostCompressionBlock>
            <TitleBlock>
                <NumberFrameBlock>
                    <NumberBlock>
                        No.{post.num}
                    </NumberBlock>
                </NumberFrameBlock>
                <EllipsisBlock>
                    {post.title}
                </EllipsisBlock>
                <CommentCounter>
                    15
                </CommentCounter>
            </TitleBlock>
            <UserBlock>
                {post.user.username}
            </UserBlock>
            <DateBlock>
                {date}
            </DateBlock>
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