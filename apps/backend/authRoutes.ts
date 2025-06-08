import { prismaClient } from 'db/client';
import express from 'express'
import { authMiddleware } from './middleware';

const router = express.Router();

router.post('/createProfile', authMiddleware, async(req, res) => {
        const userId = req.userId || "";
        const { name, email, username, imageUrl }  = req.body;
        try {
            const user = await prismaClient.user.create({
            data: {
                clerkUserId: userId,
                name: name,
                email: email,
                username: username,
                imageUrl: imageUrl
            }
        })
            res.status(200).json(user)
        } catch(e) {
            res.status(400).json({error: "Failed to create user"})
        }
    }
)

export default router 