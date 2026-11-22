import { Router } from "express"
import { rateLimit } from "express-rate-limit"
import { generateTrainingPlan } from "../lib/ai"
import { prisma } from "../lib/prisma"

export const planRouter = Router()

const limitGeneration = rateLimit({
	windowMs: 60 * 60 * 1000,
	limit: 5,
	keyGenerator: (_req, res) => res.locals.userId,
	standardHeaders: "draft-8",
	legacyHeaders: false,
	message: { error: "Too many plan requests. Try again later." },
})

planRouter.post("/generate", limitGeneration, async (_req, res) => {
	try {
		const { userId } = res.locals

		const profile = await prisma.user_profiles.findUnique({
			where: { user_id: userId },
		})

		if (!profile) {
			return res.status(400).json({ error: "User profile not found. Complete onboarding first." })
		}

		// NEED THE PLAN TABLE
		const latestPlan = await prisma.training_plans.findFirst({
			where: { user_id: userId },
			orderBy: { created_at: "desc" },
			select: { version: true },
		})

		const nextVersion = latestPlan ? latestPlan.version + 1 : 1
		let planJson

		try {
			planJson = await generateTrainingPlan(profile)
		} catch (error) {
			return res.status(500).json({
				error: "Failed to generate training plan. Please try again.",
				details: error instanceof Error ? error.message : "Unknown error",
			})
		}

		const planText = JSON.stringify(planJson, null, 2)

		const newPlan = await prisma.training_plans.create({
			data: {
				user_id: userId,
				plan_json: planJson as any,
				plan_text: planText,
				version: nextVersion,
			},
		})

		res.json({
			id: newPlan.id,
			version: newPlan.version,
			createdAt: newPlan.created_at,
		})
	} catch (_error) {
		console.error("Error generating plan:", _error)
		res.status(500).json({
			error: "Failed to generate plan",
			details: _error instanceof Error ? _error.message : "Unknown error",
		})
	}
})

planRouter.get("/current", async (_req, res) => {
	try {
		const { userId } = res.locals

		const plan = await prisma.training_plans.findFirst({
			where: { user_id: userId },
			orderBy: { created_at: "desc" },
		})

		if (!plan) {
			return res.status(404).json({ error: "No plan found" })
		}

		res.json({
			id: plan.id,
			userId: plan.user_id,
			plan: plan.plan_json,
			planText: plan.plan_text,
			version: plan.version,
			createdAt: plan.created_at,
		})
	} catch (_error) {
		res.status(500).json({ error: "Failed to fetch plan" })
	}
})
