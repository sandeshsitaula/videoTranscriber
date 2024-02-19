import {useState,useEffect,useRef} from 'react'
import axiosInstance from '../axiosInstance'
import Video from './Video'
import {useParams,Link} from 'react-router-dom'

export const CutVideoList=()=>{
   

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
    <div className="snap-y snap-mandatory overflow-y-scroll h-screen flex-grow z-0">
  {cutVideoList.length!=0 ? cutVideoList.map((video)=>{
      console.log(video)
      var messages="demo"
      var likes=100
      var shares=100
      var description="demo testing purposes"
      var channel="demo channel"
      var song="demo song"
      var url=`http://meet.fractalnetworks.co:80/${video.cut_video_path}`
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
                messages={messages}
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
  </>

)
}




