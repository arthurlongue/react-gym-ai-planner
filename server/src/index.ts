import cors from "cors"
import express from "express"
import path from "path"
import { requireUser } from "./lib/auth"
import { planRouter } from "./routes/plan"
import { profileRouter } from "./routes/profile"

const app = express()
const PORT = process.env.PORT || 3001

const allowedOrigins: (string | RegExp)[] = [
	"https://gym.artudev.com",
	...(process.env.CORS_ORIGIN?.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean) ?? []),
]
if (process.env.NODE_ENV !== "production") {
	allowedOrigins.push(/^http:\/\/localhost(?::\d+)?$/)
}

app.use(
	"/api",
	cors({
		origin: allowedOrigins,
		methods: ["GET", "POST"],
		allowedHeaders: ["Authorization", "Content-Type"],
	}),
	requireUser,
	express.json(),
)

app.use("/api/profile", profileRouter)
app.use("/api/plan", planRouter)

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
	const distPath = path.join(process.cwd(), "../dist")
	app.use(express.static(distPath))
	app.get("/{*splat}", (_req, res) => {
		res.sendFile(path.join(distPath, "index.html"))
	})
}

app.listen(PORT, () => {
	//
})
