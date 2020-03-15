import { API_AUTH, API_REST_URL, API_BASE_URL } from "./Constants";

const api = {
    rest: async (url, method, params) => {
        const response = await fetch(API_REST_URL + url, {
            method,
            headers: {
                "Authorization": `Basic ${API_AUTH.base64}`
            },
            body: params ? JSON.stringify(params) : undefined
        });

        let data = await response.json();

        if(data && data.status === "success") return data.data

        return false;
    },

    graphql: async (query, type) => {
        if(type === undefined) type = 'query'

        const response = await fetch("http://localhost/MAD/api/index.php/graphql", { // :TODO: Url should be API_BASE_URL + "graphql"
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"query": query})
        });

        let data = await response.json();

        if(data && data.data !== undefined) return data.data
        return false
    }
}

export default api;