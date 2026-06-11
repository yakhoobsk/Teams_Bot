import type { ThemeConfig } from "antd";

export const lightTheme: ThemeConfig = {
    token: {
        colorPrimary: "#0F52BA",
        colorLink: "#0F52BA",
        colorLinkHover: "#175CD3",

        colorSuccess: "#2E7D32",

        colorWarning: "#EF6C00",

        colorError: "#D32F2F",

        colorInfo: "#0F52BA",

        colorText: "#212121",
        colorTextSecondary: "#666666",
        colorTextDisabled: "#B8B8B8",

        colorBgBase: "#FFFFFF",
        colorBgLayout: "#F8FAFC",
        colorBorder: "#E0E0E0",

        borderRadius: 12,
        fontSize: 14,
        fontFamily: "'Poppins', sans-serif",
    },

    components: {
        Button: {
            borderRadius: 12,
            fontWeight: 500,
            controlHeight: 36,
        },

        Input: {
            borderRadius: 10,
        },

        Select: {
            borderRadius: 10,
        },

        Card: {
            borderRadius: 16,
        },

        Table: {
            borderRadius: 12,
            headerBg: "#F0FBFE",
            headerColor: "#0F52BA",
        },

        Tag: {
            borderRadius: 20,
        },

        Typography: {
            colorText: "#212121",
        },

        Modal: {
            borderRadiusLG: 20,
        },
    },
};