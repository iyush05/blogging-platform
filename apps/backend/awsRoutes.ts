import { prismaClient } from "db/client";
import express from "express"
import { authMiddleware } from "./middleware";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const router =  express.Router();

const s3 = new S3Client({
    region: process.env.AWS_REGION as string,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    }
})


// returns a presigned url which can later be used to upload files
router.get("/upload", async(req, res) => {
    const { slug, fileName, fileType } = req.query;

    if(!slug || !fileName || !fileType) {
        return res.status(400).json({ error: "Missing required fields" })
    }

    const key = `blogs/${slug}/${fileName}`;
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        ContentType: fileType
    })

    try {
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60})
        return res.json({url: signedUrl})
    } catch (err) {
        console.error("Presigned URL error:", err)
        return res.status(500).json({ error: "Failed to generate presigned URL"})
    }
})


export default router;