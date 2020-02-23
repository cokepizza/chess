import React from 'react';
import styled from 'styled-components';
import { FaPencilAlt } from 'react-icons/fa';
import { IconContext } from 'react-icons';

import ListContainer from '../../containers/community/ListContainer';
import WriteContainer from '../../containers/community/WriteContainer';
import PostContainer from '../../containers/community/PostContainer';

const CommunityLayoutFrameBlock = styled.div`
    width: 100%;
    height: 800px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const CommunityLayoutBlock = styled.div`
    width: 1200px;
    height: 720px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(255, 255, 255, 0.5);
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const HeaderBlock = styled.div`
    position: relative;
    display: flex;
    margin-top: 20px;
    width: 500px;
    height: 30px;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
    background: white;
`;

const SubTitleBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 125px;
    height: 30px;
    font-size: 15px;
    cursor: pointer;
`;

const MovingUnderline = styled.div`
    position: absolute;
    top: 30px;
    left: 0px;
    width: 125px;
    height: 2px;
    background: black;
    transition: 0.5s;
    left: ${props => (props.checkedIndex * 125) + 'px'};
`;

const ContentBlock = styled.div`
    display: flex;
    justify-content: center;
    width: 1000px;
    height: 600px;
    margin-top: 5px;
    /* box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12); */
    /* background: white; */
    background: transparent;
`;

const WriteFrameBlock = styled.div`
    width: 1000px;
    height: 30px;
    display: flex;
    justify-content: flex-end;    
`;

const WriteEventBlock = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0, 0, 0, 0.4);

    &:hover {
        color: rgba(0, 0, 0, 0.8);
    }
`;

const WriteBlock = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    font-size: 14px;
    height: 30px;
    cursor: pointer;  
`;

const CommunityLayout = ({
    menu,
    status,
    onClick,
    onCreatePost,
}) => {
    const checkedIndex = menu.findIndex(criteria => criteria.checked);

    return (
        <CommunityLayoutFrameBlock>
            <CommunityLayoutBlock>
                <HeaderBlock>
                    {menu.map((criteria, index) => (
                        <SubTitleBlock
                            checked={criteria.checked}
                            onClick={() => onClick(index)}
                        >
                            {criteria.name}
                        </SubTitleBlock>
                    ))}
                    <MovingUnderline checkedIndex={checkedIndex} />
                </HeaderBlock>
                <WriteFrameBlock onClick={onCreatePost}>
                    {checkedIndex !== 0 && (
                        <WriteEventBlock>
                            <IconContext.Provider value={{ style: { width:'20px', height:'20px' }}}>
                                <FaPencilAlt />
                            </IconContext.Provider>
                            <WriteBlock>
                                New Post
                            </WriteBlock>
                        </WriteEventBlock>
                    )}
                </WriteFrameBlock>
                <ContentBlock>
                    {status && status === 'list' && <ListContainer />}
                    {status && status === 'write' && <WriteContainer />}
                    {status && status === 'post' && <PostContainer />}
                </ContentBlock>
            </CommunityLayoutBlock>
        </CommunityLayoutFrameBlock>
    )
};

export default CommunityLayout;