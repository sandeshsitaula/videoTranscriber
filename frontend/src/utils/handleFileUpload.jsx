import axiosInstance from '../axiosInstance'
export const handleFileUpload = async (files,videoName, eventName = "") => {

  console.log("in file upload", eventName, files);
  const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB chunk size

  let response;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    let start = 0;
    let end = Math.min(CHUNK_SIZE, file.size);
    let newEventName=eventName
    let newVideoName=videoName
    let chunkNumber = 0;
    if (files.length>1){
     newEventName =`${eventName}_${i}`
     newVideoName=`${videoName}_${i}`
    }
    while (start < file.size) {
      const formData = new FormData();
      formData.append("video", file.slice(start, end));
      formData.append('totalVideos',files.length)
      formData.append('currentVideo',i)
      if (eventName !== "") {
        formData.append("eventName", newEventName);
      } else {
        formData.append("videoName", newVideoName);
      }

      // Add metadata to identify the chunk
      formData.append("chunkNumber", chunkNumber);
      formData.append("totalChunks", Math.ceil(file.size / CHUNK_SIZE));

      response = await axiosInstance.post("videoupload/", formData);

      chunkNumber++;
      start = end;
      end = Math.min(start + CHUNK_SIZE, file.size);
    }
  }
  return response;
};
