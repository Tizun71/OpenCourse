import axiosClient from "@/lib/api-client/axios-client";

const s3Service = {
    uploadImage: async (file: File): Promise<string> => {
        console.log("Upload image")
        const formData = new FormData();
        formData.append('file', file);
      
        const response = await axiosClient.post("/s3/upload/image", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
      
        if (response.status !== 200) {
          throw new Error('Image upload failed');
        }
      
        const result = await response.data;
        return result; 
      },
      uploadVideo: async (file: File): Promise<string> => {
        console.log("Upload Video")
        const formData = new FormData();
        formData.append('file', file);
      
        const response = await axiosClient.post("/s3/upload/video", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
      
        if (response.status !== 200) {
          throw new Error('Image upload failed');
        }
      
        const result = await response.data;
        return result; 
      }
}

export default s3Service;