import axios from "axios";
import StorageService from "../storage/StorageService";
import { User } from "../../models/user/user";
const HOST = import.meta.env.VITE_HTTP

export default class AuthService {
    static basicAuth = async (
        email: string,
        password: string
    ): Promise<void> => {
        console.log("HOST: ", HOST)
        const data = {
            email: email,
            password: password
        };

        try {
            const response = await axios.post("http://34.121.205.167/user_login/", data, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            });
            StorageService.set(StorageService.KEYS.USERTOKEN, response.data.access_token);
        } catch (e: unknown) {
            console.error("Não foi possível autenticar o usuário.", e)
            throw Error(
                "O login falhou. Verifique se suas credenciais são válidas."
            );
        }
    };

    static getUserInfo = async (): Promise<User> => {

        const token = StorageService.getUserToken()
        if (!token) {
            AuthService.signOut()
        }
        let config = {
            method: 'get',
            url: `${HOST}/users/me`,
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            const response = await axios.request(config)
            return response.data
        } catch (e: unknown) {
            console.error("Não foi recuperar os dados do usuário.", e)
            throw Error(
                "Não foi recuperar os dados do usuário."
            );
        }
    };

    static isExpiredToken = (token: any): boolean => {
        const now = Date.now()
        const tokenExpiringDate = token.exp * 1000
        return now > tokenExpiringDate
    }

    static isAuthenticated = (): boolean => {
        try {
            const token = StorageService.getUserToken()

            if (!token) {
                console.log("Sem token, saindo da aplicação...")
                AuthService.signOut()
            }
            const isExpiredToken = AuthService.isExpiredToken(token)
            if (!isExpiredToken) {
                return true
            }

            console.log("Sem token, realizando sign out...")
            AuthService.signOut()

        } catch (erro) {
            AuthService.signOut()
        }
        return false
    }

    static signOut = () => {
        StorageService.clearAll()
        window.location.href = '/';
    }
}