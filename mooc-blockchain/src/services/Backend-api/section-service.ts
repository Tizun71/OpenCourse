import { IAPI, ICourse, ISection } from "@/interface"
import axiosClient from "@/lib/api-client/axios-client";

const SectionService = {
    listSectionByCourseID: async(courseId: number) :Promise<IAPI.ApiResponse<ICourse.Section>> => {
        try{
            const response = await axiosClient.get("section/list?courseId=" + courseId)
            return response.data;
        }
        catch {
            return {
                status: 500,
                message: "Something went wrong",
                data: {} as ICourse.Section
            }
        }
    },
    listSectionForCombobox: async(courseId: number) :Promise<IAPI.ApiResponse<ISection.SectionCombobox>> => {
        try{
            const response = await axiosClient.get("/section/list-select?courseId=" + courseId)
            return response.data;
        }
        catch {
            return {
                status: 500,
                message: "Something went wrong",
            }
        }
    },
    createNewSection: async(payload: ISection.SectionCreationPayload) : Promise<IAPI.ApiResponse<number | unknown>> => {
        try {
            const response = await axiosClient.post("section/add", payload);
      const sectionId = response.data;
      return sectionId;
        }
        catch {
            return {
                status: 500,
                message: "Something went wrong",
                data: {}
            }
        }
    },
     deleteSection: async(sectionId: number) => {
         try {
            const response = await axiosClient.delete("/section/del/"+sectionId);
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

export default SectionService;