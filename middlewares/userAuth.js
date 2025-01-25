const userAuth = (req, res, next)=>{
    const token = "abp";
    const isAuthAdmin = token === "abp";

    if(!isAuthAdmin){
        res.status(401).send("User unauthorised access")
    }
    else{
        next();
    }
}
module.exports = {userAuth}