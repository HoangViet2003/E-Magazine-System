const jwt = require('jsonwebtoken');
const middlewareController ={


    verifyToken:(req, res, next) =>{
            //verifytoken 
    const token = req.headers.token; 
        if(token){
            const accessToken = token.split("")[1]; 
            jwt.verify(accessToken, process.env.AWS_ACCESS_KEY, (error,user)=>{
                if(error) {
                    return res.status(403).json("Token is not valid");
                }
                req.user = user; 
                next();
            })
        }
        else{
            return res.status(401).json("you are not authenticated");
        }
    }
}
module.exports = middlewareController;