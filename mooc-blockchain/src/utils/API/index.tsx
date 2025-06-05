import { HTTP_CONSTANTS } from "@/constants";
import { IAPI } from "@/interface";

const ApiUtils = {
  Response: {
    success: <T,>(
      data: T,
      message: string = "OK",
      status: number = HTTP_CONSTANTS.EHttpStatusCode.OK
    ): IAPI.ApiResponse<T> => {
      return {
        data,
        message,
        status,
      };
    },
    error: (
      data: any,
      message: string = "Unknown Error",
      status: number = HTTP_CONSTANTS.EHttpStatusCode.UNKNOW_ERROR
    ): IAPI.ApiResponse => {
      return {
        error: data,
        message,
        status,
      };
    },
  },
};

export default ApiUtils;
