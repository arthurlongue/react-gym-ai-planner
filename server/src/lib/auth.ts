import type { RequestHandler } from "express"
import { createRemoteJWKSet, jwtVerify } from "jose"
import "./env"

const authUrl = process.env.VITE_NEON_AUTH_URL?.trim()
if (!authUrl) {
	throw new Error("VITE_NEON_AUTH_URL is required to verify Neon Auth tokens")
}

const issuer = new URL(authUrl).origin
const jwks = createRemoteJWKSet(new URL(`${authUrl.replace(/\/+$/, "")}/.well-known/jwks.json`))

export const requireUser: RequestHandler = async (req, res, next) => {
	const token = /^Bearer (\S+)$/i.exec(req.get("authorization") ?? "")?.[1]
	if (!token) {
		res.status(401).json({ error: "Authentication required" })
		return
	}

	try {
		const { payload } = await jwtVerify(token, jwks, {
			algorithms: ["EdDSA"],
			issuer,
			audience: issuer,
			requiredClaims: ["exp", "sub"],
		})

		if (!payload.sub || payload.role !== "authenticated" || payload.banned === true) {
			res.status(401).json({ error: "Invalid session" })
			return
		}

		res.locals.userId = payload.sub
	} catch {
		res.status(401).json({ error: "Invalid session" })
		return
	}

	next()
}
