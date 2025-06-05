import { IAPI, IUser } from "@/interface";
import axiosClient from "@/lib/api-client/axios-client";

const UserService = {
    getBaseUser: async (id: number | null): Promise<IAPI.ApiResponse<IUser.BaseUser>> => {
      try {
        const response = await axiosClient.get("/user/" + id);
        return {
          status: response.status,
          message: response.data.message,
          data: response.data.data,
        };
      } catch {
        return {
          status: 500,
          message: "Something went wrong",
          data: {} as IUser.BaseUser,
        };
      }
    },
    updateUser: async(payload: any) => {
     try {
        const response = await axiosClient.put("/user/upd", payload);
        return {
          status: response.status,
          message: response.data.message,
          data: response.data.data,
        };
      } catch {
        return {
          status: 500,
          message: "Something went wrong",
          data: {} as IUser.BaseUser,
        };
      }
    },
    changePassword: async(payload: any) => {
       try {
        const response = await axiosClient.patch("/user/change-pwd", payload);
        return {
          status: response.status,
          message: response.data.message,
          data: response.data.data,
        };
      } catch {
        return {
          status: 500,
          message: "Something went wrong",
          data: {} as IUser.BaseUser,
        };
      }
    },
    forgetPassword:  async(email: string) => {
       try {
        const response = await axiosClient.get("/user/forget-pwd?email="+email);
        return {
          status: response.status,
          message: response.data.message,
          data: response.data.data,
        };
      } catch {
        return {
          status: 500,
          message: "Something went wrong",
          data: {} as IUser.BaseUser,
        };
      }
    },
    getAll: async () => {
      try {
        const response = await axiosClient.get("/user/list");
        return {
          status: response.status,
          message: response.data.message,
          data: response.data.data,
        };
      } catch {
        return {
          status: 500,
          message: "Something went wrong",
          data: {},
        };
      }
    },
    createUser: async (
      payload: IUser.UserCreationPayload
    ) => {
      try {
        const res = await axiosClient.post("/user/add", payload);
  
        const response = res.data;
        if (response.status === 400) {
          throw new Error(response.message);
        }
        return true;
      } catch (err) {
        throw err;
      }
    },
    changeRole : async (
      payload: IUser.RoleChangePayload
    ) => {
      try {
        await axiosClient.patch("/user/change-role", payload);
      }
      catch {
        return {
          status: 500,
          message: "Something went wrong",
          data: {},
        };
      }
    },
    lockToggle : async (
      userId: number
    ) => {
      try {
        await axiosClient.patch("/user/lock-toggle?userId="+userId);
      }
      catch {
        return {
          status: 500,
          message: "Something went wrong",
          data: {},
        };
      }
    },
    instructorRegister : async (
      payload: IUser.InstructorRegister
    ) => {
      try {
        await axiosClient.post("/instructor/request-register", payload);
      }
      catch {
        return {
          status: 500,
          message: "Something went wrong",
          data: {},
        };
      }
    },
    listApplication : async() => {
      try {
        const res = await axiosClient.get("/instructor/listApplication");
        return res.data;
      }
      catch {
        return {
          status: 500,
          message: "Something went wrong",
          data: {},
        };
      }
    },
    handleApplication: async(applicationId: number, isAccepted:boolean, payload: IUser.UserCreationPayload) => {
      try {
        const res = await axiosClient.post(`/instructor/handleApplication?applicationId=${applicationId}&isAccepted=${isAccepted}`, payload);
        return res.data;
      }
      catch {
        return {
          status: 500,
          message: "Something went wrong",
          data: {},
        };
      }
    },
    getProgress : async (userId: number, courseId: number) => {
       try {
        const res = await axiosClient.get(`/user/course-progress?userId=${userId}&courseId=${courseId}`);
        return res.data;
      }
      catch {
        return {
          status: 500,
          message: "Something went wrong",
          data: {},
        };
      }
    }
}

export default UserService
