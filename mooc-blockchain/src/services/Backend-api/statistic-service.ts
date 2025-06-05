import axiosClient from "@/lib/api-client/axios-client"

const StatisticService = {
    admin : async() => {
        try{
            const res = await axiosClient.get("/statistic/admin");
            return res.data
        }
        catch{
            return {
                status: 500,
                message: "Something went wrong",
                data: {}
            }
        }
    }
}
export default StatisticService;