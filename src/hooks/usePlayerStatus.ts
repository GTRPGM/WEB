import { useState, useEffect, useCallback } from 'react';
import { useChatStore } from '../store/useChatStore';
import { getPlayerStatus } from '../services/gameService';
import type { PlayerStatusResponse } from '../types';

export function usePlayerStatus() {
    const playerId = useChatStore((state) => state.playerId);
    const [playerStatus, setPlayerStatus] = useState<PlayerStatusResponse['data']['player'] | null>(null);
    const [isLoadingPlayerStatus, setIsLoadingPlayerStatus] = useState(false);
    const [playerStatusError, setPlayerStatusError] = useState<string | null>(null);

    const fetchPlayerStatus = useCallback(async () => {
        if (!playerId) {
            setPlayerStatusError('Player ID is not available.');
            return;
        }

        setIsLoadingPlayerStatus(true);
        setPlayerStatusError(null);
        try {
            const response = await getPlayerStatus(playerId);
            if (response.status === 'success') {
                setPlayerStatus(response.data.player);
            } else {
                setPlayerStatusError(response.message || 'Failed to fetch player status.');
            }
        } catch (error) {
            console.error('Error fetching player status:', error);
            setPlayerStatusError('플레이어 상태를 불러오는 데 실패했습니다.');
        } finally {
            setIsLoadingPlayerStatus(false);
        }
    }, [playerId]);

    // Fetch player status initially and whenever playerId changes
    useEffect(() => {
        if (playerId) {
            fetchPlayerStatus();
            // Optionally, set up a polling mechanism here if status needs to be real-time
            // const interval = setInterval(fetchPlayerStatus, 5000); // e.g., every 5 seconds
            // return () => clearInterval(interval);
        }
    }, [playerId, fetchPlayerStatus]);

    return {
        playerStatus,
        isLoadingPlayerStatus,
        playerStatusError,
        fetchPlayerStatus, // Allow manual refresh
    };
}
