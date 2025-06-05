import { IAPI, ICourse } from "@/interface";
import axiosClient from "@/lib/api-client/axios-client";

const CourseService = {
  listAllInstructorCourses: async (instructorId: number) => {
    try {
      const response = await axiosClient.get(`/course/${instructorId}/courses`);
      return {
        status: response.status,
        message: response.data.message,
        data: response.data.data,
      };
    } catch {
      return {
        status: 500,
        message: "Something went wrong",
        data: {} as ICourse.CourseDetail,
      };
    }
  },
  listAllCourses: async (keyword: string = "", sort: string = "", page: number = 0, size: number = 20) => {
    try {
      const response = await axiosClient.get("/course/list", {
        params: {
          keyword,
          sort,
          page,
          size,
        },
      });

      return {
        status: response.status,
        message: response.data.message,
        data: response.data.data,
      };
    } catch {
      return {
        status: 500,
        message: "Something went wrong",
        data: [],
      };
    }
  },
  listAllCoursesAdmin: async (keyword: string = "", sort: string = "", page: number = 0, size: number = 20) => {
    try {
      const response = await axiosClient.get("/course/list-all", {
        params: {
          keyword,
          sort,
          page,
          size,
        },
      });

      return {
        status: response.status,
        message: response.data.message,
        data: response.data.data,
      };
    } catch {
      return {
        status: 500,
        message: "Something went wrong",
        data: [],
      };
    }
  },
  litsRegistedCourse : async(userId?: number) => {
  try {
      const response = await axiosClient.get(`/course/registed-courses/${userId}`);
      return response.data
    } catch {
      return {
        status: 500,
        message: "Something went wrong",
        data: {} as ICourse.CourseRegistedDetail,
      };
    }
  },
  getCourseDetail: async (id: number): Promise<IAPI.ApiResponse<ICourse.CourseDetail>> => {
    try {
      const response = await axiosClient.get("/course/" + id);
      return {
        status: response.status,
        message: response.data.message,
        data: response.data.data,
      };
    } catch {
      return {
        status: 500,
        message: "Something went wrong",
        data: {} as ICourse.CourseDetail,
      };
    }
  },
  createNewCourse: async(payload: ICourse.CourseCreationPayload) : Promise<IAPI.ApiResponse<number | unknown>> => {
    try {
      const response = await axiosClient.post("/course/add", payload);
      const courseId = response.data;
      return courseId;
    }
    catch {
      return {
        status: 500,
        message: "Something went wrong",
        data: null,
      };
    }
  },
  updateCourse: async(payload: ICourse.CourseUpdatePayload) : Promise<IAPI.ApiResponse<number | unknown>> => {
    try {
      const response = await axiosClient.put("/course/upd", payload);
      const courseId = response.data;
      return courseId;
    }
    catch {
      return {
        status: 500,
        message: "Something went wrong",
        data: null,
      };
    }
  },
  updateCourseStatus: async(payload: ICourse.CourseUpdateStatusPayload) : Promise<IAPI.ApiResponse<number | unknown>> => {
    try {
      const response = await axiosClient.patch("/course/upd-status", payload);
      return response;
    }
    catch {
      return {
        status: 500,
        message: "Something went wrong",
        data: null,
      };
    }
  },
  enrollNewCourse: async(payload: ICourse.CourseEnrollmentPayload) : Promise<IAPI.ApiResponse> => {
    try {
      const response = await axiosClient.post("/enrollment/enroll", payload);
      return response;
    }
    catch {
      return {
        status: 500,
        message: "Something went wrong",
        data: null,
      };
    }
  },
  isEnrolled: async(payload: ICourse.CourseEnrollmentPayload) : Promise<IAPI.ApiResponse> => {
    try{
      console.log(payload)
      const response = await axiosClient.get(`/enrollment/check?userId=${payload.userId}&courseId=${payload.courseId}`);
      console.log(response)
      return response.data;
    }
    catch{
      return {
        status: 500,
        message: "Something went wrong",
        data: null,
      };
    }
  }
};

export default CourseService;
