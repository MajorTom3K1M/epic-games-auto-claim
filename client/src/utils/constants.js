// const API_ENDPOINT = 'https://epicauto.herokuapp.com'
const API_ENDPOINT = 'http://epic-auto.appspot.com';
// const API_ENDPOINT = 'http://localhost:3001'

export const LOGIN_ENDPOINT = `${API_ENDPOINT}/api/login`;
export const LOGIN_MFA_ENDPOINT = `${API_ENDPOINT}/api/login/mfa`;
export const FREE_GAMES_ENDPOINT = `${API_ENDPOINT}/api/freegames`;
export const USER_INFO = `${API_ENDPOINT}/api/profile`;
export const SESSION_ENDPOINT = `${API_ENDPOINT}/api/session`;
export const PURCHASE_ENDPOINT = `${API_ENDPOINT}/api/purchase`;

export const EpicArkosePublicKey = {
  LOGIN: '37D033EB-6489-3763-2AE1-A228C04103F5',
  CREATE: 'E8AD0E2A-2E72-0F06-2C52-706D88BECA75',
  PURCHASE: 'B73BD16E-3C8E-9082-F9C7-FA780FF2E68B'
}