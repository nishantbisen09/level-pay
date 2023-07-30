class LocalStorageUtil {
    // Get an item from LocalStorage
    static getItem(key) {
        try {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : null
        } catch (error) {
            console.error(
                `Error while getting LocalStorage item: ${key}`,
                error
            )
            return null
        }
    }

    // Set an item in LocalStorage
    static setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
            console.error(
                `Error while setting LocalStorage item: ${key}`,
                error
            )
        }
    }

    // Remove an item from LocalStorage
    static removeItem(key) {
        try {
            localStorage.removeItem(key)
        } catch (error) {
            console.error(
                `Error while removing LocalStorage item: ${key}`,
                error
            )
        }
    }
}

export default LocalStorageUtil
