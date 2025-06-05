import { ICategory } from "@/interface";
import axiosClient from "@/lib/api-client/axios-client"
import Cookies from "js-cookie";
const accessToken = Cookies.get("accessToken");

const CategoryService = {
    list : async() => {
        try{
            const res = await axiosClient.get("/category/list");
            return res.data
        }
        catch{
            return {
                status: 500,
                message: "Something went wrong",
                data: {}
            }
        }
    },
    add : async(payload : ICategory.CategoryCreationPayload) => {
        try{
            const res = await axiosClient.post("/category/add", payload);
            return res.data
        }
        catch{
            return {
                status: 500,
                message: "Something went wrong",
                data: {}
            }
        }
    },
    upd : async(payload : ICategory.CategoryUpdatePayload) => {
        try{
            console.log(payload)
            const res = await axiosClient.put("/category/upd", payload, {
                headers: {
                Authorization: `Bearer ${accessToken}`
            }
            });
            console.log(res)
            return res.data
        }
        catch{
            return {
                status: 500,
                message: "Something went wrong",
                data: {}
            }
        }
    },
}
export default CategoryService;