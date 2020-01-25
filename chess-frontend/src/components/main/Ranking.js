import React from 'react';
import styled from 'styled-components';
import RankImage from '../../static/image/ranking.svg';
import ListContainer from '../../containers/main/ListContainer';

const RankingBlock = styled.div`
    width: 720px;
    height: 720px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px;
    background-color: rgba(255,255,255,0.5);
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const BackgroundFrameBlock = styled.div`
    position: relative;
    width: 90%;
    height: 90%;
`

const BackgroundBlock = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.1;
`;

const ListBlock = styled.div`

`;

const Ranking = () => {


    return (
        <RankingBlock>
            <BackgroundFrameBlock>
                <BackgroundBlock src={RankImage}/>
            </BackgroundFrameBlock>
            <ListContainer />
        </RankingBlock>
    )
};

export default React.memo(Ranking);