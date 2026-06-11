import axios from "axios";
import config from "./config";
import { getSecureItem, setSecureItem } from "../../utils/webSecureStorage";
import { decryptIfNeeded } from "../../utils/cryptoAES";


const AiApi = axios.create({
    baseURL: config.BASEURL,
    headers: config.headersCommon,
    timeout: 20000,
});


const boomiApi = axios.create({
    baseURL: config.BOOMI_BASEURL,
    headers: config.headersCommon,
    timeout: 20000,
});


AiApi.interceptors.request.use(
    async (configuration: any) => {
        try {
            const token = import.meta.env.VITE_AI_BASIC_TOKEN;

            if (token) {
                setSecureItem("aiAccessToken", token);
            }

            const encryptedToken = getSecureItem("aiAccessToken");

            configuration.headers = configuration.headers || {};

            if (encryptedToken !== null) {
                const decryptedToken = decryptIfNeeded(encryptedToken);

                if (decryptedToken) {
                    configuration.headers.Authorization = `Basic ${decryptedToken}`;
                }
            }
        } catch (error) {
            console.log(error);
        }

        return configuration;
    },
    (error) => {
        return Promise.reject(error);
    }
);


boomiApi.interceptors.request.use(
    async (configuration: any) => {
        try {
            const token = import.meta.env.VITE_BOOMI_BASIC_TOKEN;

            if (token) {
                setSecureItem("boomiAccessToken", token);
            }

            const encryptedToken = getSecureItem("boomiAccessToken");

            configuration.headers = configuration.headers || {};

            if (encryptedToken !== null) {
                const decryptedToken = decryptIfNeeded(encryptedToken);

                if (decryptedToken) {
                    configuration.headers.Authorization = `Basic ${decryptedToken}`;
                }
            }
        } catch (error) {
            console.log(error);
        }

        return configuration;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const urlGenarator = (url: any, pagination: any) => {
    let queryString = "?";
    Object.keys(pagination).map((key) => {
        queryString += key + "=" + pagination[key] + "&"
    })

    return (url + queryString).slice(0, -1);
}

const decryptedToken = () => {
    const encryptedToken = getSecureItem("accessToken");

    if (encryptedToken !== null) {
        return decryptIfNeeded(encryptedToken);
    }

    return null;
};

export { AiApi, urlGenarator, decryptedToken, boomiApi }