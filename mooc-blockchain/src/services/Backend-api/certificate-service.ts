import { ICertificate} from "@/interface"
import axiosClient from "@/lib/api-client/axios-client";

const CertificateService = {
    mint: async(payload: ICertificate.CertificateMint) => {
        try{
            const response = await axiosClient.post("/certificate/mint", payload)
            return response.data;
        }
        catch {
            return {
                status: 500,
                message: "Something went wrong",
                data: {}
            }
        }
    },

    SHA256Converter: async(content: string) => {
        try{
            const response = await axiosClient.post("/certificate/hash", content)
            return response.data
        }
         catch {
            return {
                status: 500,
                message: "Something went wrong",
                data: {}
            }
        }
    }
}

export default CertificateService;