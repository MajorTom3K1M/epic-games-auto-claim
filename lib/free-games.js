const Login = require("../lib/login");
const {
    GRAPHQL_ENDPOINT,
    STORE_CONTENT,
    FREE_GAMES_PROMOTIONS_ENDPOINT,
} = require('../common/constants');

class FreeGames {
    constructor(requestClient) {
        this.request = requestClient;
    }

    getFreeGames = async () => {
        const freeGamesSearchParams = {
            locale: 'en',
            country: 'US',
            allowCountries: 'US',
        };
        const resp = await this.request.get(FREE_GAMES_PROMOTIONS_ENDPOINT, {
            searchParams: freeGamesSearchParams,
        });
        const nowDate = new Date();
        const freeOfferedGames = resp.body.data.Catalog.searchStore.elements.filter(offer => {
            let r = false;
            if (offer.promotions) {
                offer.promotions.promotionalOffers.forEach(innerOffers => {
                    innerOffers.promotionalOffers.forEach(pOffer => {
                        const startDate = new Date(pOffer.startDate);
                        const endDate = new Date(pOffer.endDate);
                        const isFree = pOffer.discountSetting.discountPercentage === 0;
                        if (startDate <= nowDate && nowDate <= endDate && isFree) {
                            r = true;
                        }
                    });
                });
            }
            return r;
        });
        return freeOfferedGames;
    }

    ownsGame = async (linkedOfferNs, linkedOfferId) => {
        const query = `
            query launcherQuery($namespace:String!, $offerId:String!) {
                Launcher {
                    entitledOfferItems(namespace: $namespace, offerId: $offerId) {
                        namespace
                        offerId
                        entitledToAllItemsInOffer
                        entitledToAnyItemInOffer
                    }
                }
            }
        `;
        const variables = {
            namespace: linkedOfferNs,
            offerId: linkedOfferId
        }
        const data = { query, variables };
        const entitlementResp = await this.request.post(GRAPHQL_ENDPOINT, {
            json: data
        });
        // console.log(entitlementResp.body.data.Launcher.entitledOfferItems);
        if (entitlementResp.body.errors && entitlementResp.body.errors[0]) {
            const error = entitlementResp.body.errors[0];
            const errorJSON = JSON.parse(error.serviceResponse);
            if (errorJSON.errorCode.includes('authentication_failed')) {
                const login = new Login(this.request);
                await login.refreshAndSid(true);
                return this.ownsGame(linkedOfferNs, linkedOfferId);
            }
            this.response.status(400).json({ message: error.message })
        }
        const items = entitlementResp.body.data.Launcher.entitledOfferItems;
        return items.entitledToAllItemsInOffer && items.entitledToAnyItemInOffer;
    }

    getPurchasableFreeGames = async (validOffers) => {
        const ownsGamePromises = validOffers.map(offer => {
            return this.ownsGame(offer.namespace, offer.id);
        });
        const ownsGames = await Promise.all(ownsGamePromises);
        const purchasableGames = validOffers
            // .filter((offer, index) => {
            //     return !ownsGames[index];
            // })
            .map((offer, index) => {
                if(offer.price &&  offer.price.lineOffers && offer.price.lineOffers[0].appliedRules[0].endDate) {
                    var endDate = offer.price.lineOffers[0].appliedRules[0].endDate;
                }
                return {
                    offerNamespace: offer.namespace,
                    offerId: offer.id,
                    productName: offer.title,
                    productSlug: offer.productSlug,
                    purchasable: !ownsGames[index],
                    keyImages: offer.keyImages,
                    endDate: endDate
                };
            });
        return purchasableGames;
    }


    updateIds = async (offers) => {
        const promises = offers.map(async (offer, index) => {
            const productTypes = offer.categories.map(cat => cat.path);
            if (productTypes.includes('games')) {
                const url = `${STORE_CONTENT}/products/${offer.productSlug.split('/')[0]}`;
                const productsResp = await this.request.get(url);
                let mainGamePage = productsResp.body.pages.find(page => page._slug === 'home');
                if (!mainGamePage) {
                    [mainGamePage] = productsResp.body.pages;
                }
                if (!mainGamePage) {
                    throw new Error('No product pages available');
                }
                return {
                    ...offers[index],
                    id: mainGamePage.offer.id,
                    namespace: mainGamePage.offer.namespace,
                };
            }
            if (productTypes.includes('bundles')) {
                const url = `${STORE_CONTENT}/bundles/${offer.productSlug.split('/')[0]}`;
                const bundlesResp = await this.request.get(url);
                return {
                    ...offers[index],
                    id: bundlesResp.body.offer.id,
                    namespace: bundlesResp.body.offer.namespace,
                };
            }
            throw new Error(`Unrecognized productType: ${productTypes}`);
        });
        const responses = await Promise.all(promises);
        return responses;
    }

    getAllFreeGames = async () => {
        const validFreeGames = await this.getFreeGames();
        const updatedOffers = await this.updateIds(validFreeGames);
        const purchasableGames = await this.getPurchasableFreeGames(updatedOffers);
        return purchasableGames;
    }
}

module.exports = FreeGames;