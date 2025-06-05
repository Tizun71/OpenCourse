import { IAPI, IEvent,  } from "@/interface";
import axiosClient from "@/lib/api-client/axios-client";

const EventService = {
  getEventList: async (userId: number, startedDate: Date, endedDate: Date): Promise<IAPI.ApiResponse<IEvent.EventResponse[]>> => {
    try {
      const response = await axiosClient.get("/event/list", {
        params: {
          userId,
          startedDate: startedDate.toISOString(), 
          endedDate: endedDate.toISOString(),
        },
      });
      return {
        status: response.status,
        message: response.data.messaege || response.data.message,
        data: response.data.data,
      };
    } catch{
      return {
        status: 500,
        message: "Something went wrong",
        data: [],
      };
    }
  },

  createEvent: async (payload: IEvent.EventCreationRequest): Promise<IAPI.ApiResponse> => {
    try {
      const response = await axiosClient.post("/event/add", payload);
      return {
        status: response.status,
        message: response.data.message,
        data: response.data.data,
      };
    } catch{
      return {
        status: 500,
        message: "Something went wrong",
        data: {},
      };
    }
  },

  updateEvent: async (payload: IEvent.EventUpdateRequest): Promise<IAPI.ApiResponse> => {
    try {
      const response = await axiosClient.post("/event/upd", payload);
      return {
        status: response.status,
        message: response.data.message,
        data: response.data.data,
      };
    } catch{
      return {
        status: 500,
        message: "Something went wrong",
        data: {},
      };
    }
  },

  deleteEvent: async (eventId: number): Promise<IAPI.ApiResponse<null>> => {
    try {
      const response = await axiosClient.delete(`/event/del/${eventId}`);
      return {
        status: response.status,
        message: response.data.message,
        data: null,
      };
    } catch{
      return {
        status: 500,
        message: "Something went wrong",
        data: null,
      };
    }
  },
};

export default EventService;
