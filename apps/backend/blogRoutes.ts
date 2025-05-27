import express from 'express'
import { prismaClient } from 'db/client';
import { authMiddleware } from './middleware';

const router = express.Router();

router.post("/createBlog", authMiddleware, async(req, res) => {
    const authorId = req.userId || "";
    try {
        const response = await prismaClient.blog.create({
        data: {
            authorId: authorId,
            content: req.body.content,
            title: req.body.title
        }
    })
        res.status(200).json({message: "Blog Created"})
    } catch(e) {
        res.status(401).json({message: "Error creating blog"})
    }
})

export default router