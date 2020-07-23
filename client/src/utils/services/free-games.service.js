import Axios from 'axios'
import {
    FREE_GAMES_ENDPOINT,
    PURCHASE_ENDPOINT
} from '../constants';

export const freegamesService = {
    getFreeGames,
    purhcase
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

function purhcase(email) {
    const requestOption = {
        method: 'POST',
        url: PURCHASE_ENDPOINT,
        data: {
            email
        }
    };
    return Axios(requestOption)
        .then(handleStatusResponse)
        .catch(handleError)
}

function handleStatusResponse(response) {
    const { status, statusText } = response;
    return { status, statusText };
}

function handleDataResponse(response) {
    const { data } = response;
    return data;
}

function handleError(error) {
    throw error;
}