export interface User {
	id: string
	email: string
	createdAt: Date
}

export interface UserProfile {
	userId: string
	goal: "cut" | "bulk" | "recomp" | "strength" | "endurance"
	experience: "beginner" | "intermediate" | "advanced"
	daysPerWeek: number
	sessionLength: number
	equipment: "full_gym" | "home_gym" | "dumbbells"
	injuries?: string
	preferredSplit: "full_body" | "upper_lower" | "push_pull_legs" | "custom"
	updatedAt?: string
}

export interface PlanOverview {
	goal: string
	frequency: string
	split: string
	notes: string
}

export interface Exercise {
	name: string
	sets: number
	reps: string
	rest: string
	rpe: number
	notes?: string
	alternatives?: string[]
}

export interface DaySchedule {
	day: string
	focus: string
	exercises: Exercise[]
}

export interface TrainingPlan {
	id: string
	userId: string
	plan: {
		overview: PlanOverview
		weeklySchedule: DaySchedule[]
		progression: string
	}
	planText: string
	version: number
	createdAt: string
}

export interface SaveProfileRequest extends Omit<UserProfile, "userId" | "updatedAt"> {
	userId: string
}

export interface SaveProfileResponse {
	success: true
}

export interface GeneratePlanRequest {
	userId: string
}

export interface GeneratePlanResponse {
	id: string
	version: number
	createdAt: string
}

export interface OnboardingFormValues {
	goal: UserProfile["goal"]
	experience: UserProfile["experience"]
	daysPerWeek: string
	sessionLength: string
	equipment: UserProfile["equipment"]
	preferredSplit: UserProfile["preferredSplit"]
	injuries: string
}
