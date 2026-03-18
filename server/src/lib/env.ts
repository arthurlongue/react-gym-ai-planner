import dotenv from "dotenv"
import { existsSync } from "node:fs"
import path from "node:path"

const envPaths = [
	path.resolve(process.cwd(), ".env.local"),
	path.resolve(process.cwd(), ".env"),
	path.resolve(process.cwd(), "..", ".env.local"),
	path.resolve(process.cwd(), "..", ".env"),
]

for (const envPath of envPaths) {
	if (existsSync(envPath)) {
		dotenv.config({ path: envPath })
	}
}
