import { prismaClient } from 'db/client';
import express from 'express'
import { authMiddleware } from './middleware';

const router = express.Router();

// router.post('/:id', authMiddleware, async (req, res) => {
//         try {
//             const response = await prismaClient.user.findUnique({
//             where: {
//                 clerkUserId: req.params.id
//             }
//         })
//             return res.status(200).json(response)
//         } catch(e) {
//             return res.status(401).json("user not found");
//         }
        
//     }
// )

router.post('/create', authMiddleware, async ( req, res) => {
    const userId = req.userId || "";
    const { name, username, bio, email, imageUrl } = req.body;
    const updateData: any = {};
    if(name !== undefined) updateData.name = name;
    if(username !== undefined) updateData.username = username;
    if(bio !== undefined) updateData.bio = bio;
    console.log(updateData);
    try {
        const response = await prismaClient.user.create({
            data: {
                clerkUserId: userId,
                name: name,
                username: username,
                bio: bio,
                email: email,
                imageUrl: imageUrl
            }
        })
        res.status(200).json(response)
    } catch (err) {
        console.log("Error updating profile", err)
        res.status(400).json(err)
    }
})

export default router 