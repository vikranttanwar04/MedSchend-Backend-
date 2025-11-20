import { v2 as cloudinary } from 'cloudinary';
import ExpressError from '../src/custom_error_msg/custom_error_msg.js';

function uploadToCloudinary(file) {
    return new Promise((resolve, reject) => {
        try{
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: "image" },
                (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                }
            )
            stream.end(file.buffer);
        }catch(err){
            throw new ExpressError(500, err.message);
        }
    })
}

export default uploadToCloudinary;