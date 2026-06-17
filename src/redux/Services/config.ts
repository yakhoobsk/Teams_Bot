
const BASEURL = import.meta.env.VITE_API_URL;
const CRYPTO_KEY = import.meta.env.VITE_CRYPTO_KEY_SECRET;
console.log("BASE URL =>", BASEURL);
const config = {
    BASEURL: BASEURL,
    cryptoKey: CRYPTO_KEY,

    headersCommon: {
        "Content-Type": "application/json"
    },

};

export default config;
