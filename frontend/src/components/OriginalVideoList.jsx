import {useState,useEffect} from 'react'
import axiosInstance from '../axiosInstance'
export const OriginalVideoList=()=>{
    const [videoList,setVideoList]=useState(null)
useEffect(()=>{
   async function getVideos(){
    const response=await axiosInstance.get('getallvideos/')
    console.log(response.data)
    setVideoList(response.data.data)
}
getVideos()
},[])
useEffect(()=>{
    console.log(videoList)
})
return(
  <>
  <h3>All Videos</h3>
  {videoList && videoList.map((video)=>{
      return(
      <div style={{cursor:'pointer',color:'white',backgroundColor:'gray',marginTop:'1rem',padding:'1rem'}} >
      {video}
      </div>
      )
})}
  </>
)
}
