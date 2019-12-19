import React from 'react';
import styled from 'styled-components';
import CommunityTableRow from './CommunityTableRow';

const CommunityLayoutBlock = styled.div`
    width: 100%;
    height: 1000px;
    background-color:#EDEBE9;
    display: flex;
    justify-content: center;
    /* flex-direction: column; */
`;

const CommunityMainBlcok = styled.main`
    width: 80%;
    height: 1000px;
    background-color:lightblue;
    display: flex;
    flex-direction: column;
`;

const CommunityHeaderBlock = styled.h1`
    width: 100%;
    height: 150px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0px 0px 0px 0px;
`;

const PageDivBlock = styled.div`
    width: 100%;
    height: 50px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const CommunityTableBlock = styled.table`
    width: 100%;
    height: 700px;
    background-color: white;
`;

const CommunityTheadBlock = styled.thead`
    width: 100%;
    background-color: #F1F1F1;
`;




const CommunityLayout = () => {
    const tableRows = [
        {
            title: '가즈아 가즈아 가즈아 가즈아1',
            count: 250,
            comments: 7,
            time: '1시간 전'
        },
        {
            title: '가즈아 가즈아 가즈아 가즈아2',
            count: 251,
            comments: 8,
            time: '2시간 전'
        },
        {
            title: '가즈아 가즈아 가즈아 가즈아3',
            count: 252,
            comments: 9,
            time: '3시간 전'
        },
        {
            title: '가즈아 가즈아 가즈아 가즈아4',
            count: 253,
            comments: 10,
            time: '4시간 전'
        }
    ];
    return (
        <CommunityLayoutBlock>
            <CommunityMainBlcok>
                <CommunityHeaderBlock>
                    General Chess Discussion
                </CommunityHeaderBlock>
                <PageDivBlock>
                    &lt; 1 2 3 4 ... &gt;
                </PageDivBlock>
                <CommunityTableBlock>  
                    <CommunityTheadBlock>
                        <tr height='60px'>
                            <th width='70%'>
                            </th>
                            <th>
                                조회
                            </th>
                            <th>
                                답글
                            </th>
                            <th>
                                최근 글
                            </th>
                        </tr>
                    </CommunityTheadBlock>
                    {tableRows.map(tableRow => (
                        <CommunityTableRow title={tableRow.title} count={tableRow.count} comments={tableRow.comments} time={tableRow.time} />
                    ))}
                </CommunityTableBlock>
                <PageDivBlock>
                    &lt; 1 2 3 4 ... &gt;
                </PageDivBlock>

            </CommunityMainBlcok>
        </CommunityLayoutBlock>
    )
};

export default CommunityLayout;