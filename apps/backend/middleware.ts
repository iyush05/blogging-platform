import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    // console.log(token);
    
    if(!token) {
        res.status(401).json({message: "No token Unauthorized"});
        return
    }
    const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY!, {
        algorithms: ["RS256"],
    });
    // console.log(decoded);
    
    if(!decoded) {
        res.status(401).json({message: "decoded givin BT Unauthorized"})
        return 
    }

    const userId = (decoded as any).sub;
    // console.log({"userId": userId});
    
    if(!userId) {
        res.status(401).json({message: "userid ntpresent Unauthorized"})
        return
    }

    req.userId = userId;        // this is clerkUserId
    next();
}