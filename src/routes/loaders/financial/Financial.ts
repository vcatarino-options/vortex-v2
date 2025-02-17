import axios from "axios";

export default class Financial {
    static VORTEX_SERVER: string = import.meta.env.VITE_VORTEX_SERVER
    static getSelic = async () => {
        
        try {

            const response = await axios.get(`${Financial.VORTEX_SERVER}/get_risk_free/`, {
                headers: {
                    'accept': 'application/json'
                },
            });
            console.log("SELIC: ", response.data)

            return { selic: response.data }

        } catch (e: unknown) {
            let status = { status: undefined } as any;
            if (axios.isAxiosError(e)) {
                console.error("Financial Loader: ", e);
                status.status = e?.response?.status || 0
            }
            console.error(
                "Financial Loader: ",
                e
            );
            throw {
                message: "Ocorreu um erro ao tentar recuperar a taxa selic!",
            }

        }
    };

}