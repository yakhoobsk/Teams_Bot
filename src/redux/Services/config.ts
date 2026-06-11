
const BASEURL = import.meta.env.VITE_API_URL;
const BOOMI_BASEURL = import.meta.env.VITE_API_BOOMI_URL;
const CRYPTO_KEY = import.meta.env.VITE_CRYPTO_KEY_SECRET;

const config = {
    BASEURL,
    BOOMI_BASEURL,
    cryptoKey: CRYPTO_KEY,

    headersCommon: {
        "Content-Type": "application/json",
    },
};

export default config;