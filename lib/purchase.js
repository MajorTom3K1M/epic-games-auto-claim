const { JSDOM } = require('jsdom');
const {
    ORDER_CONFIRM_ENDPOINT,
    ORDER_PREVIEW_ENDPOINT,
    EPIC_PURCHASE_ENDPOINT
} = require('../common/constants');

class Purchase {
    constructor(requestClient, email) {
        this.request = requestClient;
        this.email = email;
    }

    comfirmOrder = async (orderPreview, purchaseToken, captcha = "") => {
        const confirmOrderRequest = {
            captchaToken: captcha,
            useDefault: true,
            setDefault: false,
            namespace: orderPreview.namespace,
            country: orderPreview.country,
            countryName: orderPreview.countryName,
            orderId: orderPreview.orderId,
            orderComplete: orderPreview.orderComplete || false,
            orderError: orderPreview.orderError || false,
            orderPending: orderPreview.orderPending || false,
            offers: orderPreview.offers,
            includeAccountBalance: false,
            totalAmount: 0,
            affiliateId: '',
            creatorSource: '',
            threeDSToken: '',
            voucherCode: null,
            syncToken: orderPreview.syncToken,
            eulaId: null,
            useDefaultBillingAccount: true,
            canQuickPurchase: true
        };
        const confirmOrderResp = await this.request.post(ORDER_CONFIRM_ENDPOINT, {
            json: confirmOrderRequest,
            headers: {
                'x-requested-with': purchaseToken
            }
        });
        if (
            confirmOrderResp.body.errorCode &&
            confirmOrderResp.body.errorCode.includes('captcha.challenge')
        ) {
            console.log('Captcha required');
            const newPreview = orderPreview;
            newPreview.syncToken = confirmOrderResp.body.syncToken;
            // login again with captcha token
            // confirm order again with captcha
        } else {
            console.log('Purchase successful');
        }
    }

    purchase = async (linkedOfferNs, linkedOfferId) => {
        const purchaseSearchParams = {
            namespace: linkedOfferNs,
            offers: linkedOfferId,
        };

        const purchasePageResp = await this.request.get(EPIC_PURCHASE_ENDPOINT, {
            searchParams: purchaseSearchParams,
            responseType: 'text'
        });

        const purchaseDocument = new JSDOM(purchasePageResp.body).window.document;
        let purchaseToken = '';
        const purchaseTokenInput = purchaseDocument.querySelector('#purchaseToken');

        if (purchaseTokenInput && purchaseTokenInput.value) {
            purchaseToken = purchaseTokenInput.value;
        } else {
            throw new Error('Missing purchase token');
        }

        console.log('purchaseToken');
        const orderPreviewRequest = {
            useDefault: true,
            setDefault: false,
            namespace: linkedOfferNs,
            country: null,
            countryName: null,
            orderId: null,
            orderComplete: null,
            orderError: null,
            orderPending: null,
            offers: [linkedOfferId],
            offerPrice: '',
        };
        console.log('Order preview request');

        const orderPreviewResp = await this.request.post(ORDER_PREVIEW_ENDPOINT, {
            json: orderPreviewRequest,
            headers: {
                'x-requested-with': purchaseToken
            }
        });
        console.log('Order preview response');

        if (orderPreviewResp.body.orderResponse && orderPreviewResp.body.orderResponse.error) {
            throw new Error(orderPreviewResp.body.orderResponse.message);
        }
        await this.comfirmOrder(orderPreviewResp.body, purchaseToken);
        return orderPreviewResp;
    }

    purchaseGames = async (offers) => {
        const resp = [];
        for (let i = 0; i < offers.length; i += 1) {
            if (offers[i].purchasable) {
                resp.push(await this.purchase(offers[i].offerNamespace, offers[i].offerId));
            }
        }
        console.log('offers purchase successfully');
    }
}

module.exports = Purchase;