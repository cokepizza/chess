import React from 'react';
import styled from 'styled-components';
import { FaChessKing } from 'react-icons/fa';
import { IconContext } from 'react-icons';

const IconBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    cursor: pointer;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.2), 0 1px 5px 0 rgba(0,0,0,0.12);

    background-color: ${props => props.checked && 'rgba(0,0,0,0.1)' };
    &:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }
`;

const Icon = ({ checked, kind, onClick }) => {
    const opposite = kind === 'white' ? 'black' : 'white';
    const styleObj = {
        style: {
            color: kind,
            filter: `drop-shadow(1px 1px 1px ${opposite})`,
            width: '30px',
            height: '30px',
        }
    };

    return (
        <IconBlock
            checked={checked ? 1 : 0}
            onClick={() => onClick(kind)}
        >
            <IconContext.Provider value={styleObj}>
                <FaChessKing />
            </IconContext.Provider>
        </IconBlock>
    )
};

export default React.memo(Icon);