// src/services/scenarioService.ts
import { api } from "../apiinterceptor";

export const scenarioService = {
    async getCurrentScenarioId(): Promise<{ scenario_id: string; description: string } | null> {
        const response = await api.get('/state/scenarios');
        const scenarios = response.data.data;
        return (Array.isArray(scenarios) && scenarios.length > 0) ? scenarios[0] : null;
    },

    async startSession(scenario_id: string) {
        const response= await api.post('/state/session/start', { scenario_id });
        return response.data.data;
    },

    async getPlayerStatus(player_id: string) {
        const response = await api.get(`/state/player/${player_id}`);
        return response.data.data;
    }
};
