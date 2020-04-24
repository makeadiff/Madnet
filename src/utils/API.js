import { API_AUTH, API_REST_URL, API_BASE_URL } from "./Constants";

const api = {

    rest: async (url, method, params) => {
        url = url.replace('//', '/') // Sometimes the argument url might have a '/' at the start. Causes an error.
        const response = await fetch(API_REST_URL + url, {
            method: method,
            headers: { 
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Basic ${API_AUTH.base64}`
            },
            body: params ? JSON.stringify(params) : undefined
        });
        if(response.ok) {
            // If its a delete call, it might have no return. 
            let response_text = await response.text()
            if(response_text) {
                let data = JSON.parse(response_text)
                if(data && data.status === "success") return data.data
            } else {
                if(method === "delete") return true
            }
        } else {
            throw response
        }

        return false;
    },

    graphql: async (query, type) => {
        if(type === undefined) type = 'query'

        const response = await fetch(API_BASE_URL + "graphql", { // If getting touble, try "http://localhost/MAD/api/index.php/graphql"
            method: "POST",
            headers: {
                "Accept": "application/json",
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