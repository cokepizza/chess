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

const PostTitleBlock = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 90%;
    height: 30px;
    background: white;
    cursor: pointer;
    box-sizing: border-box;
    padding: 0px 20px;
    margin-bottom: 5px;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const PostContentBlock = styled.div`
    font-size: 12px;
    width: 90%;
    height: 479px;
    box-sizing: border-box;
    background: white;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const Post = ({ post }) => {
    return (
        <PostBlock>
            <PostTitleBlock>
                {post && post.title}
            </PostTitleBlock>
            <PostContentBlock dangerouslySetInnerHTML={{ __html: (post ? post.content : null) }} />
        </PostBlock>
    )
};

export default React.memo(Post);