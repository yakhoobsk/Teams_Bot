import SecureLS from "secure-ls";

const SecureLSClass: any = (SecureLS as any).default || SecureLS;

let secureLS: any = null;

if (typeof window !== "undefined") {
    secureLS = new SecureLSClass({
        encodingType: "aes",
        isCompression: false,
    });
}

export const setSecureItem = (key: string, value: string) => {
    if (secureLS) secureLS.set(key, value);
};

export const getSecureItem = (key: string): any => {

    try {
        const encryptedToken: any = secureLS ? secureLS.get(key) : null;
        if (encryptedToken !== null) {
            if (encryptedToken) {

                return encryptedToken
            }
        }
    } catch (error) {
    }
};

export const removeSecureItem = (key: string) => {
    if (secureLS) secureLS.remove(key);
};
