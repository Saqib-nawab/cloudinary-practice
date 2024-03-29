import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ThreeDots } from 'react-loader-spinner'

const Upload = () => {

    const [img, setImg] = useState(null);
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    //this is unauthenticated( http ) request which is why we don't need to send any other parameters (no timestamp and signature)
    const uploadFile = async (type) => {
        const data = new FormData();
        //a normal upload requires the file and upload preset information
        data.append("file", type === 'image' ? img : video); //file could be an image file or a video
        data.append("upload_preset", type === 'image' ? 'images_preset' : 'videos_preset'); //these presets are created in the cloudinary account

        try {
            let cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME; //from cloudinary account credentials
            let resourceType = type === 'image' ? 'image' : 'video';
            let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

            const res = await axios.post(api, data); //for http requests
            const { secure_url } = res.data;
            console.log(secure_url);
            return secure_url;
        } catch (error) {
            console.error(error);
        }
    }

    //this is unauthenticated( http ) request which is why we don't need to send any other parameters (no timestamp and signature)
    const handleSubmit = async (e) => {
        e.preventDefault(); //stopping the page reloading on itself
        try {
            setLoading(true);

            // Upload image file
            const imgUrl = await uploadFile('image');

            // Upload video file
            const videoUrl = await uploadFile('video');

            // Send backend api request
            await axios.post(`${process.env.REACT_APP_BACKEND_BASEURL}/api/videos`, { imgUrl, videoUrl });

            // Reset states 
            setImg(null);
            setVideo(null);

            console.log("File upload success!");
            setLoading(false);
            navigate("/")
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="video">Video:</label>
                    <br />
                    <input
                        type="file"
                        accept="video/*"
                        id="video"
                        onChange={(e) => setVideo((prev) => e.target.files[0])}
                    />
                </div>
                <br />
                <div>
                    <label htmlFor="img">Image:</label>
                    <br />
                    <input
                        type="file"
                        accept="image/*"
                        id="img"
                        onChange={(e) => setImg((prev) => e.target.files[0])}
                    />
                </div>
                <br />
                <button type="submit">Upload</button>
            </form>

            {
                loading && <ThreeDots
                    height="80"
                    width="80"
                    radius="9"
                    color="#4fa94d"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                />
            }
        </div>


    )
}

export default Upload