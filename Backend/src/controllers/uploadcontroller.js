import supabase from '../config/supabase.js';
export const uploadAttachment = async(req,res)=>
{
    try{
        if(!req.file)
        {
            return res.status(400).json({success:false,message:"No selected file"})
        }

        const file = req.file;
        const fileName = `${Date.now()}-${file.originalname}`;
        const {error} = await supabase.storage.from("Uppload").upload(fileName,file.buffer,{contentType:file.mimetype,upsert:false});

        if(error)
        {
            console.error("Upload error",error.message);
            return res.status(500).json({success:false,message:"File upload failed"})
        }
        const {data} = supabase.storage.from("Uppload").getPublicUrl(fileName);

        return res.status(200).json({success:true,url:data.publicUrl,fileName:file.originalname,fileType:file.mimetype})
    }
    catch(error)
    {
        console.error("Attachment upload error",error.message);
        return res.status(500).json({success:false,message:"Internal server error"})
    }
}