import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000'

const api = axios.create({
    baseURL: API_BASE_URL,
})

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        // Modify config if needed (e.g., adding authorization headers)
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        // Handle successful response data if needed (e.g., parsing JSON)
        return response.data
    },
    (error) => {
        // Handle error responses (e.g., showing error messages)
        return Promise.reject(error)
    }
)

export default api
