exports.getDownloads = async(req, res, next) => {
    try {
        const downloads = await req.user.getDownloads();
        res.json(downloads);
    }catch(Err){
        res.status(500).json({success: false, message: Err});
    }
}