import { IAPI, ILesson } from "@/interface";
import axiosClient from "@/lib/api-client/axios-client";

const LessonService = {
    getDetailLesson : async(lessonId: number) : Promise<IAPI.ApiResponse> => {
        try{
            const response = await axiosClient.get("/lesson/"+lessonId);
            console.log(response);
            return response.data;
        }
        catch{
            return {
                status: 500,
                message: "Something went wrong",
                data: {}
            }
        }
    },
    createNewLesson : async(payload: ILesson.LessonCreationPayload) : Promise<IAPI.ApiResponse> => {
        try {
            const response = await axiosClient.post("/lesson/add", payload);

            return response
        }
        catch{
            return {
                status: 500,
                message: "Something went wrong",
                data: {}
            }
        }
    },
    markLessonComplete: async(payload: ILesson.LessonMarkCompletePayload) : Promise<IAPI.ApiResponse> => {
        try {
            const response = await axiosClient.post(`/lesson/check?userId=${payload.userId}&lessonId=${payload.lessonId}`);
            return response
        }
        catch {
            return {
                status: 500,
                message: "Something went wrong",
                data: {}
            }
        }
    },
    deleteLesson: async(lessonId: number) => {
         try {
            const response = await axiosClient.delete("/lesson/del/"+lessonId);
            return response
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

export default LessonService;