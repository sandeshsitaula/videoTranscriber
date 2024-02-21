import {useState,useEffect,useRef} from 'react'
import axiosInstance from '../axiosInstance'
import Video from '../components/videoPlayer/Video'
import {useParams,Link} from 'react-router-dom'
import './CutVideo.css'
export const CutVideoList=()=>{
    const mutedRef=useRef(true)
     const {video_id}=useParams()
    console.log(video_id)
    const [cutVideoList,setCutVideoList]=useState([])
useEffect(()=>{

   async function getVideos(){
       try{
    const response=await axiosInstance.get(`getcutvideos/${video_id}/`)
    setCutVideoList(response.data.data)
       }catch(error){
           console.log(error)
    }
}
getVideos()
},[])

return(
  <>
    <div className="app">
       <div className="container">
  {cutVideoList.length!=0 ? cutVideoList.map((video)=>{
      console.log(video)
      var comments=100
      var likes=100
      var shares=100
      var description="demo testing purposes description"
      var channel="demo channel"
      var song="demo song"
      var cut_video_id=video.cut_video_id
      console.log(cut_video_id)
      var video_name=video.cut_video_path.split('/')[2]
      var video_ids_list=video_name.split('_')
      var video_id=video_ids_list[video_ids_list.length-2]
     console.log(video_id)
      var url=`http://meet.fractalnetworks.co:8080/hls/playlist_${video_id}.m3u8`
      console.log(url)
      var video_name=video.cut_video_path.split('/')[2]
     {/* return(
      <Link key={video.cut_video_id}
to={`http://meet.fractalnetworks.co:80/${video.cut_video_path}`}><div
style={{cursor:'pointer',color:'white',backgroundColor:'gray',marginTop:'1rem',
padding:'1rem'}} >
      {video_name}
      </div>
      </Link>
      )*/}
                    return (


                    <Video
                key={video.cut_video_id}
                comments={comments}
                cut_video_id={cut_video_id}
                video_id={video_id}
                mutedRef={mutedRef}
                likes={likes}
                shares={shares}
                description={description}
                channel={channel}
                song={song}
                url={url}
              />

                    )

}):"No Videos to Load"}
</div>
 </div>
  </>

)
}




