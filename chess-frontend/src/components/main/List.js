import React from 'react';
import styled from 'styled-components';

const ListBlock = styled.div`
    height: 600px;
    width: 100%;
`;

const ListCellBlock = styled.div`
    height: 30px;
    width: 100%;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);
`;

const ListCell = React.memo(({ cell }) => {
    return (
        <ListCellBlock
            
        >
            {cell.username}
        </ListCellBlock>
    )
});

const List = ({ list }) => {
    console.dir(list);
    const listArr = list && list
        .map(cell => (
                <ListCell
                    key={cell.username}
                    cell={cell}
                />
            )
        );

    return (
        <ListBlock>
            {listArr}
        </ListBlock>
    )
};

export default React.memo(List);