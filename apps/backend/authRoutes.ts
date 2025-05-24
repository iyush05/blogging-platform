import express from 'express'

const router = express.Router();

router.get('', authMiddleware, async(req, res) )