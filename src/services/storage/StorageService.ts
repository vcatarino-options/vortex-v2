export default class StorageService {
    static KEYS = {
        USERTOKEN: "userToken",
        TOKENMONITOR: "tokenMonitor"
    }

    static set(index: string, value: string) {
        localStorage.setItem(index, value)
    }

    static clearAll() {
        localStorage.clear()
    }

    static getUserToken() {
        try {
            const token = localStorage.getItem(StorageService.KEYS.USERTOKEN)
            return token
        } catch (error: unknown) {
            console.error("Não foi possível recuperar o token do usuário.", error)
            throw error
        }
    }

    static get(key: string) {
        try {
            const item = localStorage.getItem(key)
            return item
        } catch (error: unknown) {
            console.error(`Não foi possível recuperar o item [${key}].`, error)
            throw error
        }
    }
}