export default class StorageService {
    static KEYS = {
        USERTOKEN: "userToken",
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
}