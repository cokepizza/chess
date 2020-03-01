import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import GamesModal from './GamesModal';
import { disconnectWebsocket as disconnectGamesWebsocket } from '../modules/games';
    
const GamesModalContainer = ({ history, openModal, setOpenModal, ...rest }) => {
    const [ modal, setModal ] = useState(false);
    const { games } = useSelector(({ games }) => ({
        games: games.games,
    }));
    const dispatch = useDispatch();

    const onBackgroundClick = useCallback(e => {
        setModal(false);
        setOpenModal(false);
        dispatch(disconnectGamesWebsocket());
    }, [dispatch, setOpenModal])

    const onContentClick = useCallback(e => {
        e.stopPropagation();
    }, [])

    const onGameClick = useCallback((e, key) => {
        setModal(false);
        setOpenModal(false);
        dispatch(disconnectGamesWebsocket());
        history.push(`/game/${key}`);
    }, [dispatch, history, setOpenModal]);

    useEffect(() => {
        setModal(openModal);
    }, [openModal]);

    console.dir('gamesmodal~~');
    useEffect(() => {
        return () => {
            dispatch(disconnectGamesWebsocket());
        }
    }, [dispatch]);

    return (
        <>
            <GamesModal
                {...rest}
                games={games}
                open={modal}
                onBackgroundClick={onBackgroundClick}
                onContentClick={onContentClick}
                onGameClick={onGameClick}
            >
            </GamesModal>
        </>
    )
};

export default withRouter(GamesModalContainer);