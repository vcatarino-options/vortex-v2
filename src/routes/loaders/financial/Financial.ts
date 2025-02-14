import axios from "axios";

export default class Financial {
    static HOST: string = "34.95.213.62:80"
    static getSelic = async () => {
        console.log("HOST: ", Financial.HOST)

        try {

            const response = await axios.get(`http://${Financial.HOST}/get_risk_free/`, {
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