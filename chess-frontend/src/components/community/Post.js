import React from 'react';
import styled from 'styled-components';

const PostBlock = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    box-sizing: border-box;
    padding-top: 5px;
    width: 100%;
    height: 100%;
`;

const PostTitleFrameBlock = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 90%;
    height: 30px;
    background: white;
    box-sizing: border-box;
    padding: 0px 15px;
    margin-bottom: 5px;
    font-size: 13px;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const PostTitleBlock = styled.div`
    width: 50%;
`;

const PostAuthFrameBlock = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 50%;
    font-size: 11px;
`;

const PostAuthBlock = styled.div`
    padding-right: 20px;
`;

const PostDateBlock = styled.div`

`;

const PostContentBlock = styled.div`
    width: 90%;
    height: 479px;
    font-size: 13px;
    box-sizing: border-box;
    background: white;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
    
    line-height: 1.42;
    outline: none;
    overflow-y: auto;
    padding: 12px 15px;
    tab-size: 4;
    -moz-tab-size: 4;
    text-align: left;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: Helvetica, Arial, sans-serif;

    p {
        margin: 0px;
    }
`;

const UtilBlock = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 90%;
    height: 30px;
    margin-top: 5px;
`;

const ButtonBlock = styled.button`
    width: 100px;
    height: 100%;
    background: white;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
    padding: 0px;
    border: none;
    margin: 0px;
    outline: none;
    cursor: pointer;

    & + & {
        margin-left: 5px;
    }

    &:hover {
        background: rgba(0, 0, 0, 0.05);
    }

    &:active {
        background: rgba(0, 0, 0, 0.1);
    }
`;

const Post = ({ post, auth, onUpdate, onDelete }) => {
    let date = null;
    if(post) {
        const createdAt = new Date(Date.parse(post.createdAt));
        date = createdAt.getFullYear() + " / " + createdAt.getMonth() + " / " + createdAt.getDate();
    }
    
    return (
        <PostBlock>
            <PostTitleFrameBlock>
                <PostTitleBlock>
                    {post && post.title}
                </PostTitleBlock>
                <PostAuthFrameBlock>
                    <PostAuthBlock>
                        {post && post.user.username}
                    </PostAuthBlock>
                    <PostDateBlock>
                        {date}
                    </PostDateBlock>
                </PostAuthFrameBlock>
            </PostTitleFrameBlock>
            <PostContentBlock dangerouslySetInnerHTML={{ __html: (post ? post.content : null) }} />
            <UtilBlock>
                <ButtonBlock
                    disabled={!auth || !post || auth._id !== post.user._id}
                    onClick={() => onUpdate(post)}
                >
                    Update
                </ButtonBlock>
                <ButtonBlock
                    disabled={!auth || !post || auth._id !== post.user._id}
                    onClick={() => onDelete(post._id)}
                >
                    Delete
                </ButtonBlock>
            </UtilBlock>
        </PostBlock>
    )
};

export default React.memo(Post);