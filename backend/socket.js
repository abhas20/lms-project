import { Server } from "socket.io";
import CourseChat from "./models/CourseChat.js";
import LiveQuizResult from "./models/LiveQuizResult.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// In-memory store for active quizzes
const liveQuizzes = new Map(); 

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        process.env.FRONTEND_URL,
        "http://localhost:5173",
        "https://lms-by-tle-terminator.vercel.app",
        "http://lmsbytle.codes",
        "https://lmsbytle.codes",
        "http://www.lmsbytle.codes",
        "https://www.lmsbytle.codes",
      ],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // ================= EXISTING CHAT LOGIC =================
    socket.on("join_course", ({ courseId }) => {
      socket.join(`course_${courseId}`);
    });

    socket.on("send_message", async ({ courseId, userId, message }) => {
      if (!message?.trim()) return;
      const chat = await CourseChat.create({
        courseId, sender: userId, message, upvotes: 0, voters: [],
      });
      const populated = await chat.populate("sender", "name");
      io.to(`course_${courseId}`).emit("receive_message", {
        _id: populated._id, courseId, sender: populated.sender, message: populated.message,
        upvotes: populated.upvotes, voters: populated.voters, createdAt: populated.createdAt,
      });
    });

    socket.on("upvote_message", async ({ messageId, courseId, userId }) => {
      if (!mongoose.Types.ObjectId.isValid(messageId)) return;
      const chat = await CourseChat.findById(messageId);
      if (!chat) return;
      const hasUpvoted = chat.voters.some((id) => id.toString() === userId);
      if (hasUpvoted) {
        chat.voters = chat.voters.filter((id) => id.toString() !== userId);
        chat.upvotes = Math.max(0, chat.upvotes - 1);
      } else {
        chat.voters.push(userId);
        chat.upvotes += 1;
      }
      await chat.save();
      io.to(`course_${courseId}`).emit("message_upvoted", {
        messageId, upvotes: chat.upvotes, voters: chat.voters,
      });
    });

    // ================= 🚀 LIVE QUIZ ARENA LOGIC =================

    // 1. TEACHER CREATES OR RESUMES ROOM
    socket.on("host_create_quiz", ({ roomCode }, callback) => {
      let room = liveQuizzes.get(roomCode);
      
      if (room) {
        room.hostSocket = socket.id;
        socket.join(roomCode);
        console.log(`🎓 Host Reconnected to Room: ${roomCode}`);
        
        socket.emit("host_state_restored", {
           playersCount: Object.keys(room.players).length,
           isLive: !!room.currentQuestion,
           currentQuestion: room.currentQuestion
        });
      } else {
        liveQuizzes.set(roomCode, {
          hostSocket: socket.id,
          players: {},
          currentQuestion: null,
          active: true
        });
        socket.join(roomCode);
        console.log(`🎓 Quiz Room Created: ${roomCode}`);
      }
      
      if (typeof callback === "function") callback({ status: "success" });
    });

    // 🔥 NEW: TEACHER NUKES THE ROOM TO RESET CODES/SCORES 🔥
    socket.on("host_end_room", ({ roomCode }) => {
        const room = liveQuizzes.get(roomCode);
        if (room && room.hostSocket === socket.id) {
            // Tell all students the room is dead so they clear their cache
            io.to(roomCode).emit("room_closed");
            // Delete from backend memory
            liveQuizzes.delete(roomCode);
            console.log(`🗑️ Room ${roomCode} destroyed by Host.`);
        }
    });

    // 2. STUDENT JOINS ROOM
    socket.on("student_join_quiz", ({ roomCode, name, userId }, callback) => {
      const room = liveQuizzes.get(roomCode);
      if (room && room.active) {
        socket.join(roomCode);
        
        let player = null;
        let existingPlayerSocketId = Object.keys(room.players).find(id => {
            const p = room.players[id];
            if (userId && p.userId === userId) return true;
            if (!userId && !p.userId && p.name === name) return true;
            return false;
        });

        if (existingPlayerSocketId) {
            player = room.players[existingPlayerSocketId];
            room.players[socket.id] = player;
            if (existingPlayerSocketId !== socket.id) {
                delete room.players[existingPlayerSocketId];
            }
        } else {
            player = { userId, name, score: 0, answers: [] };
            room.players[socket.id] = player;
        }
        
        io.to(room.hostSocket).emit("player_joined", { 
          count: Object.keys(room.players).length,
          name 
        });
        
        socket.emit("join_success", { roomCode });

        if (room.currentQuestion) {
            socket.emit("restore_active_question", {
                question: room.currentQuestion.question,
                options: room.currentQuestion.options,
                timeLimit: room.currentQuestion.timeLimit,
                hasAnswered: player.currentAnswer !== undefined && player.currentAnswer !== null,
                answerIndex: player.currentAnswer
            });
        }

        if (typeof callback === "function") callback({ status: "success" });
      } else {
        socket.emit("error_msg", { message: "Room not found or inactive" });
        if (typeof callback === "function") {
          callback({ status: "error", message: "Room not found. Ensure the Teacher's room is active." });
        }
      }
    });

    // 3. TEACHER LAUNCHES QUESTION
    socket.on("host_push_question", ({ roomCode, questionData }) => {
      const room = liveQuizzes.get(roomCode);
      if (room) {
        room.currentQuestion = { ...questionData, startTime: Date.now() };
        
        Object.values(room.players).forEach(p => p.currentAnswer = null);
        
        io.to(roomCode).emit("receive_question", {
          question: questionData.question,
          options: questionData.options,
          timeLimit: questionData.timeLimit
        });
      }
    });

    // 4. STUDENT SUBMITS ANSWER
    socket.on("student_submit_answer", ({ roomCode, answerIndex, userId, name }) => {
      const room = liveQuizzes.get(roomCode);
      if (room && room.currentQuestion) {
        
        let player = room.players[socket.id];

        if (!player) {
          const oldSocketId = Object.keys(room.players).find(id => {
             const p = room.players[id];
             return (userId && p.userId === userId) || (p.name === name);
          });
          
          if (oldSocketId) {
             player = room.players[oldSocketId];
             room.players[socket.id] = player;
             delete room.players[oldSocketId];
          }
        }

        if (player && (player.currentAnswer === undefined || player.currentAnswer === null)) { 
          const timeTaken = Date.now() - room.currentQuestion.startTime;
          player.currentAnswer = answerIndex;
          player.responseTime = timeTaken;
          
          const isCorrect = answerIndex === room.currentQuestion.correctIndex;
          let points = 0;
          
          if (isCorrect) {
            points = 1; 
            player.score += points;
          }

          if (!player.answers) player.answers = [];

          player.answers.push({
            questionIndex: 0,
            answerIndex,
            isCorrect,
            points,
            timeTaken
          });

          io.to(room.hostSocket).emit("live_answer_update", {
            totalAnswers: Object.values(room.players).filter(p => p.currentAnswer !== undefined && p.currentAnswer !== null).length
          });
        }
      }
    });

    // 5. TEACHER ENDS QUESTION
    socket.on("host_show_results", async ({ roomCode }) => {
      const room = liveQuizzes.get(roomCode);
      if (!room || !room.currentQuestion) return; // Added safety check

      const stats = [0, 0, 0, 0];
      const leaderboard = [];
      const participantsData = [];

      // 🔥 FIX: Extract the correctIndex BEFORE we clear the currentQuestion!
      const finalCorrectIndex = room.currentQuestion.correctIndex; 

      Object.entries(room.players).forEach(([socketId, p]) => {
        if (p.currentAnswer !== undefined && p.currentAnswer !== null) {
          stats[p.currentAnswer]++;
        }
        
        leaderboard.push({ name: p.name, score: p.score });
        
        participantsData.push({
          userId: p.userId,
          name: p.name,
          answerIndex: p.currentAnswer,
          isCorrect: p.currentAnswer === room.currentQuestion.correctIndex,
          score: p.answers && p.answers.length ? p.answers[p.answers.length-1].points : 0,
          responseTime: p.responseTime || 0
        });
      });

      leaderboard.sort((a, b) => b.score - a.score);
      const top5 = leaderboard.slice(0, 5);

      try {
        const result = new LiveQuizResult({
          roomCode,
          question: room.currentQuestion.question,
          options: room.currentQuestion.options,
          correctIndex: room.currentQuestion.correctIndex,
          timeLimit: room.currentQuestion.timeLimit,
          startedAt: new Date(room.currentQuestion.startTime),
          endedAt: new Date(),
          participants: participantsData,
          stats: {
            totalPlayers: Object.keys(room.players).length,
            answeredCount: participantsData.length,
            optionCounts: stats
          }
        });
        await result.save();
      } catch (error) {
        console.error("Failed to save quiz result:", error);
      }

      // We clear the room state so users can't submit late answers
      room.currentQuestion = null;

      // 🔥 FIX: We now use finalCorrectIndex instead of room.currentQuestion.correctIndex
      io.to(roomCode).emit("question_results", {
        correctIndex: finalCorrectIndex, 
        stats,
        leaderboard: top5
      });
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
};