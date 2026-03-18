import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import path from "path"
import "./lib/env"
import { planRouter } from "./routes/plan"
import { profileRouter } from "./routes/profile"

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(cookieParser())
app.use(express.json())

//API Routes
app.use("/api/profile", profileRouter)
app.use("/api/plan", planRouter)

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
	const distPath = path.join(process.cwd(), "../dist")
	app.use(express.static(distPath))
	app.get("*", (_req, res) => {
		res.sendFile(path.join(distPath, "index.html"))
	})
}

app.listen(PORT, () => {
	//
})
