import express from 'express'
import { prismaClient } from 'db/client';
import { authMiddleware } from './middleware';

const router = express.Router();

// create the blog when the user clicks on createBlog button and not when the user visits the createPage because on
// createBlogPage when the user refreshes the page the saveBlogToDatabase function will reset all the written text 
// so only fetch hte blog when the user visits the createBlog page so that data persists even after refresh
// ( because now the refresh only calls the fetch func and not the create func which will overwrite everything)

router.post("/createBlog", authMiddleware, async(req, res) => {
    const authorId = req.userId || "";      // this is clerkUserId
    // const data = {
    //     authorId: authorId,
    //     content: req.body.content,
    //     title: req.body.title,
    //     slug: req.body.slug
    // }
    // console.log("data: ", data)
    try {
        console.log("middleware working")
        const response = await prismaClient.blog.create({
        data: {
            authorId: authorId,
            content: req.body.content,
            title: req.body.title,
            slug: req.body.slug
        }
    })
        res.status(200).json({message: "Blog Created"})
    } catch(e) {
        res.status(401).json({message: "Error creating blog"})
    }
})

router.post("/updateBlog", authMiddleware, async(req, res) => {
    const authorId = req.userId || "";
    try {
        const response = await prismaClient.blog.update({
            where: {
                slug: req.body.slug
            },
            data: {
                // authorId: authorId,
                content: req.body.content,
                title: req.body.title
            }
    })
        res.status(200).json({message: "Blog Created"})
    } catch(e) {
        res.status(401).json({message: "Error creating blog"})
    }
})

router.get("/getBlog", async(req, res) => {
    try {
        const response = await prismaClient.blog.findUnique({
            where: {
                slug: req.query.slug as string
            }
        })
        res.status(200).json(response)
    } catch(e) {
        res.status(404).json({message: "Error fetching blog"})
    }
})

export default router