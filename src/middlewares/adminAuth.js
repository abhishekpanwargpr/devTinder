
const adminAuth = (req, res, next)=>{
    const token = "abp";
    const isAuthAdmin = token === "abp";

    if(!isAuthAdmin){
        res.status(401).send("Unauthorised access")
    }
    else{
        next();
    }
}

module.exports = {adminAuth}