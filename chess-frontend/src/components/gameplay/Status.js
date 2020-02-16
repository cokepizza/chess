import React from 'react';
import styled, { css } from 'styled-components';
import { IconContext } from 'react-icons';
import { FaCircle, FaRegCircle } from 'react-icons/fa';

const StatusBlock = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 30px;
    background-color: white;

    ${props => props.beneath && css`
        margin-top: 30px;
    `}
`;

const NameBlock = styled.div`
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Status = ({ light, name, beneath }) => {
    const iconStyle = {
        style: {
            height: '15px',
            width: '10%',
            color: 'green',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }
    };

    return (
        <StatusBlock beneath={beneath ? 1 : 0}>            
            {light
                ? (
                    <IconContext.Provider value={iconStyle}>
                        <FaCircle />
                    </IconContext.Provider>
                )
                : (
                    <IconContext.Provider value={{ style: { ...iconStyle.style, color: 'black' }}}>
                        <FaRegCircle />
                    </IconContext.Provider>
                )
            }
            <NameBlock>
                {name}
            </NameBlock>
        </StatusBlock>
    )
};


export default React.memo(Status);