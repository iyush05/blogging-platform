import express from 'express'
import { authMiddleware } from './middleware';
import { GoogleGenAI } from "@google/genai";
import axios from "axios"
import { prismaClient } from 'db/client';

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

router.get('/summary', async (req, res) => {
    const slug = req.query.slug;
    try {
         const blog = await prismaClient.blog.findUnique({
            where: {
                slug: slug as string,
            } 
         })
         if(!blog) {
            return res.status(400).json({message: "Error fetching blogs"})
         }
         const content = JSON.stringify(blog.content);
;

        const result = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
            {
                role: "user",
                parts: [{ text: content}]
            },
        ],
        config: {
            systemInstruction: `You will be given a blog in JSON format. This JSON contains a structured representation of a blog post, including headings, paragraphs, and other elements. Your task is:
                                Extract only the values of all "text" fields present anywhere in the JSON structure.
                                Ignore all other keys, types, or formatting details.
                                Using the collected text values, generate a concise summary in NOT more than 50 words that captures the overall meaning and essence of the blog.`
        }
    })
    const summary  = result.candidates?.[0]?.content?.parts?.[0]?.text;

    res.status(200).json(summary);
    } catch(err) {
        console.error(err);
        res.status(401).json({message: "Error generating Summary"})
    }
})

export default router