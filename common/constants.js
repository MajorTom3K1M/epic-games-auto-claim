const CSRF_ENDPOINT = 'https://www.epicgames.com/id/api/csrf';
const ACCOUNT_CSRF_ENDPOINT = 'https://www.epicgames.com/account/v2/refresh-csrf';
const ACCOUNT_SESSION_ENDPOINT = 'https://www.epicgames.com/account/personal';
const LOGIN_ENDPOINT = 'https://www.epicgames.com/id/api/login';
const REDIRECT_ENDPOINT = 'https://www.epicgames.com/id/api/redirect';

const GRAPHQL_ENDPOINT = 'https://www.epicgames.com/store/backend/graphql-proxy'; // Reqiores store-token cookie for auth
const EPIC_CLIENT_ID = '875a3b57d3a640a6b7f9b4e883463ab4';
const ARKOSE_BASE_URL = 'https://epic-games-api.arkoselabs.com';
const CHANGE_EMAIL_ENDPOINT = 'https://www.epicgames.com/account/v2/api/email/change';
const USER_INFO_ENDPOINT = 'https://www.epicgames.com/account/v2/personal/ajaxGet';
const RESEND_VERIFICATION_ENDPOINT = 'https://www.epicgames.com/account/v2/resendEmailVerification';

const REPUTATION_ENDPOINT = 'https://www.epicgames.com/id/api/reputation';
const STORE_CONTENT = 'https://store-content.ak.epicgames.com/api/en-US/content';
const EMAIL_VERIFY = 'https://www.epicgames.com/id/api/email/verify';
const SETUP_MFA =
  'https://www.epicgames.com/account/v2/security/ajaxUpdateTwoFactorAuthSettings';

const FREE_GAMES_PROMOTIONS_ENDPOINT =
  'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions';
const STORE_HOMEPAGE = 'https://www.epicgames.com/store/en-US/';
const ORDER_CONFIRM_ENDPOINT =
  'https://payment-website-pci.ol.epicgames.com/purchase/confirm-order';
const ORDER_PREVIEW_ENDPOINT =
  'https://payment-website-pci.ol.epicgames.com/purchase/order-preview';
const EPIC_PURCHASE_ENDPOINT = 'https://www.epicgames.com/store/purchase';
// https://www.epicgames.com/id/api/login/mfa
const MFA_LOGIN_ENDPOINT = 'https://www.epicgames.com/id/api/login/mfa';
const SET_SID_ENDPOINT = 'https://www.unrealengine.com/id/api/set-sid';

module.exports = {
    CSRF_ENDPOINT,
    ACCOUNT_CSRF_ENDPOINT,
    ACCOUNT_SESSION_ENDPOINT,
    LOGIN_ENDPOINT,
    REDIRECT_ENDPOINT,
    GRAPHQL_ENDPOINT,
    EPIC_CLIENT_ID,
    ARKOSE_BASE_URL,
    CHANGE_EMAIL_ENDPOINT,
    USER_INFO_ENDPOINT,
    RESEND_VERIFICATION_ENDPOINT,
    REPUTATION_ENDPOINT,
    STORE_CONTENT,
    EMAIL_VERIFY,
    SETUP_MFA,
    FREE_GAMES_PROMOTIONS_ENDPOINT,
    STORE_HOMEPAGE,
    ORDER_CONFIRM_ENDPOINT,
    ORDER_PREVIEW_ENDPOINT,
    EPIC_PURCHASE_ENDPOINT,
    MFA_LOGIN_ENDPOINT,
    SET_SID_ENDPOINT
}