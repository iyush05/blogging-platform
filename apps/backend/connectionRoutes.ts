import express from 'express'
import { prismaClient } from 'db/client';
import { authMiddleware } from './middleware';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
    const userId = req.query.id;
    const connections = await prismaClient.connection.findMany({
    where: {
      OR: [
        { requesterId: userId },
        { receiverId: userId }
      ],
      status: 'ACCEPTED'
    },
    include: {
      requester: true,
      receiver: true,
    }
  });

  return res.json(connections);
})
export default router