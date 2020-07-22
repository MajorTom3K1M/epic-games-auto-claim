import Axios from 'axios'
import {
    FREE_GAMES_ENDPOINT
} from '../constants';

export const freegamesService = {
    getFreeGames
}

function getFreeGames(email) {
    const requestOption = {
        method: 'POST',
        url: FREE_GAMES_ENDPOINT,
        data: {
            email
        }
    };
    return Axios(requestOption)
        .then(handleDataResponse)
        .catch(handleError)
}

function handleDataResponse(response) {
    const { data } = response;
    return data;
}

function handleError(error) {
    throw error;
}