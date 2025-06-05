import axiosClient from "@/lib/api-client/axios-client";

/**
 * @param keyword
 * @param sort
 * @param page
 * @param pageSize
 * Output Object
 */
export const listPublisedCourses = async (params = {}) => {
  const response = await axiosClient.get("/course/list", { params });
  return response.data;
};

/**
 * @param courseId
 * Output Object
 */
export const getCourse = async(courseId: number) => {
  const response = await axiosClient.get("/cousre/" + courseId)
  return response.data;
}
