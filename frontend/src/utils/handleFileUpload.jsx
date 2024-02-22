import axiosInstance from '../axiosInstance'
  export const handleFileUpload = async (file,videoName) => {
const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB chunk size

      var start = 0;
      var end = Math.min(CHUNK_SIZE, file.size);
      let chunkNumber = 0;
      let response;
      while (start < file.size) {
        const formData = new FormData();
        formData.append("video", file.slice(start, end));
        formData.append("videoName", videoName);

        // Add metadata to identify the chunk
        formData.append("chunkNumber", chunkNumber);
        formData.append("totalChunks", Math.ceil(file.size / CHUNK_SIZE));

        response = await axiosInstance.post("videoupload/", formData);

        chunkNumber++;
        start = end;
        end = Math.min(start + CHUNK_SIZE, file.size);
      }
      return response

  }
