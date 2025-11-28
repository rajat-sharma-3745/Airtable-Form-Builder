export const server = import.meta.env.VITE_BACKEND_URL;


export const API_PATHS = {
    AUTH: {
        LOGIN: '/auth/airtable/login',
        CALLBACK:`/auth/airtable/callback`
    },
    FORM: {
        BASES: "/forms/bases",
        TABLES: (baseId) => `/forms/${baseId}/tables`,
        CREATE: "/forms",
        GET_FORM: (formId) => `/forms/${formId}`,
        GETUSERFORMS:'/forms/user/all',
    },

    RESPONSE: {
        SUBMIT: (formId) => `/responses/${formId}/submit`,
        LIST: (formId) => `/responses/${formId}/responses`,
    },

}