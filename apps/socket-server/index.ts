import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("like", ({ blogId, userId, delta }) => {
        io.emit("like_update", { blogId, userId, delta});
    });

    socket.on("dislike", ({ blogId, userId, delta}) => {
        io.emit("like_update", {blogId, userId, delta})
    })

    socket.on("comment", () => {
        io.emit("comment_update");
    })

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

httpServer.listen(4000, () => {
    console.log("Socket server listening on http://localhost:4000")
});
