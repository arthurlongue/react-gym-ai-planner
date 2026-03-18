import type {
	GeneratePlanRequest,
	GeneratePlanResponse,
	SaveProfileRequest,
	SaveProfileResponse,
	TrainingPlan,
} from "../types"

const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://localhost:3001")

async function request<T>(path: string, init: RequestInit) {
	const res = await fetch(`${BASE_URL}/api${path}`, init)

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

	generatePlan: (body: GeneratePlanRequest) => {
		return post<GeneratePlanResponse>("/plan/generate", body)
	},

	getCurrentPlan: (params: { userId: string }) => {
		return get<TrainingPlan>(`/plan/current?userId=${encodeURIComponent(params.userId)}`)
	},
}
