import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";


dotenv.config();

import { logger, httpLogger } from "#lib/logger";
import { errorHandler } from "#middlewares/error-handler";
import { notFoundHandler } from "#middlewares/not-found";
import userRouter from "#routes/user.routes";
import authRouter from "#routes/auth.routes";
import { config } from "#config/env";
import profileRouter from "#routes/profile.routes";
const app = express();
const PORT = config.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(httpLogger);
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: config.SESSION_SECRET || "VotreSecretTrèsSécurisé",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 jours
    }
}));


// Routes
app.get("/", (req, res) => {
  res.json({ success: true, message: "API Express opérationnelle" });
});

// Utilisation des routes
app.use("/users", userRouter);
app.use("/", authRouter); // Pour garder /register et /login à la racine
// Profile routes
app.use("/profile", profileRouter)

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);
;

app.listen(PORT, () => {
  logger.info(`Serveur démarré sur <http://localhost>:${PORT}`);
});
