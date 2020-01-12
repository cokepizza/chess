import React, { useState } from 'react';
import initItem from './testItems';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import CommunityTableRow from './CommunityTableRow';
import CommunityHeaderBlock from './CommunityHeader';
import CommunityFooterBlock from './CommunityFooter';
import TestBlock from './CommunityContent';

const CommunityLayoutBlock = styled.div`
    width: 100%;
    min-height: 700px;
    background-color:#EDEBE9;
    display: flex;
    justify-content: center;
`;

const CommunityMainBlock = styled.main`
    width: 80%;
    min-height: 720px;
    background-color:lightblue;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: rgba(255, 255, 255);
    box-shadow:0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const CommunityNameBlock = styled.h1`
    width: 100%;
    height: 100px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0px 0px 0px 0px;
`;

// const PageDivBlock = styled.div`
//     display:flex;
//     width: 100%;
//     height: 50px;
//     background-color: white;
//     display: flex;
//     justify-content: center;
//     align-items: center;
// `;

const CommunityTableBlock = styled.div`
    width: 90%;
    height: auto;
    align-self:center;
    justify-content:center;
    align-items:center;
    background-color: rgba(255, 255, 255);
    box-shadow:0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const CommunityLayout = () => {
    const [items, setItems] = useState(initItem);
    return (
        <>
        <Route path="/Community"
        exact
        render={() => 
        <CommunityLayoutBlock>
            <CommunityMainBlock>
                <CommunityNameBlock>
                    General Chess Discussion
                </CommunityNameBlock>
                <CommunityTableBlock>
                    <CommunityHeaderBlock />
                    {items.map(tableRow => (
                        <CommunityTableRow title={tableRow.title} count={tableRow.count} comments={tableRow.comments} time={tableRow.time} />
                    ))}
                    <CommunityFooterBlock />
                </CommunityTableBlock>
            </CommunityMainBlock>
        </CommunityLayoutBlock>}
        />
        <Route path="/Community/Contents" component={TestBlock}/>
        </>
    )
};

export default CommunityLayout;