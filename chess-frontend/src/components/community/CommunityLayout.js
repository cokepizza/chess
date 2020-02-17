import React from 'react';
import styled from 'styled-components';
import BulletinLayoutContainer from '../../containers/community/BulletinLayoutContainer';

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
    background: rgba(0, 0, 0, 0.05);
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
    width: 1000px;
    height: 600px;
    margin-top: 35px;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;


const CommunityLayout = ({ community, onClick }) => {
    const checkedIndex = community.findIndex(commun => commun.checked);

    return (
        <CommunityLayoutFrameBlock>
            <CommunityLayoutBlock>
                <HeaderBlock>
                    {community.map((commun, index) => (
                        <SubTitleBlock
                            checked={commun.checked}
                            onClick={() => onClick(index)}
                        >
                            {commun.name}
                        </SubTitleBlock>
                    ))}
                    <MovingUnderline checkedIndex={checkedIndex} />
                </HeaderBlock>
                <ContentBlock>
                    <BulletinLayoutContainer index={checkedIndex} />
                </ContentBlock>
            </CommunityLayoutBlock>
        </CommunityLayoutFrameBlock>
    )
};

export default CommunityLayout;