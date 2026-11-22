import type {
	GeneratePlanResponse,
	SaveProfileRequest,
	SaveProfileResponse,
	TrainingPlan,
} from "../types"
import { authClient } from "./auth"

const BASE_URL =
	import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:3001")

async function request<T>(path: string, init: RequestInit) {
	const { data, error } = await authClient.getSession()
	if (error) {
		throw new Error(error.message ?? "Unable to check session")
	}

	const token = data?.session.token
	if (!token) {
		throw new Error("Authentication required")
	}

	const headers = new Headers(init.headers)
	headers.set("Authorization", `Bearer ${token}`)
	const res = await fetch(`${BASE_URL}/api${path}`, { ...init, headers })

	if (!res.ok) {
		const payload = await res.json().catch(() => ({}))
		const message = payload.error || payload.message || "Request failed"
		throw new Error(payload.details ? `${message}: ${payload.details}` : message)
	}

	return (await res.json()) as T
}

async function post<T>(path: string, body: object) {
	return request<T>(path, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	})
}

async function get<T>(path: string) {
	return request<T>(path, {
		method: "GET",
	})
}

export const api = {
	saveProfile: (body: SaveProfileRequest) => {
		return post<SaveProfileResponse>("/profile", body)
	},

	generatePlan: () => {
		return request<GeneratePlanResponse>("/plan/generate", { method: "POST" })
	},

	getCurrentPlan: () => {
		return get<TrainingPlan>("/plan/current")
	},
}
