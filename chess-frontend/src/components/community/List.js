import React from 'react';
import styled from 'styled-components';

const ListBlock = styled.div`

`;

const ContentBlock = styled.div`

`;

const List = ({ list }) => {
    return (
        <ListBlock>
            {list && list.posts.map(post => (
                <ContentBlock>
                    {post.title}
                </ContentBlock>
            ))}
        </ListBlock>
    );
};

export default List;