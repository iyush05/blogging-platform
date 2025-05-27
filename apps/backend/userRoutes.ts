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

export default router 