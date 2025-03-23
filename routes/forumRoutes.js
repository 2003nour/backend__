const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { createTopic, getAllTopics, getTopicById, addMessage } = require("../controllers/forumController");

const router = express.Router();

router.post("/topic", authMiddleware, createTopic); // ✅ Créer un sujet
router.get("/topics", authMiddleware, getAllTopics); // ✅ Récupérer tous les sujets
router.get("/topic/:id", authMiddleware, getTopicById); // ✅ Récupérer un sujet avec ses messages
router.post("/topic/:id/message", authMiddleware, addMessage); // ✅ Ajouter un message à un sujet

module.exports = router;
