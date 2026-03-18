import type { UserProfile } from "../../types"

type Goal = UserProfile["goal"]
type Experience = UserProfile["experience"]
type Equipment = UserProfile["equipment"]
type PreferredSplit = UserProfile["preferredSplit"]

export const goalOptions: Array<{ label: string; value: Goal }> = [
	{ label: "Cut", value: "cut" },
	{ label: "Bulk", value: "bulk" },
	{ label: "Recomp", value: "recomp" },
	{ label: "Strength", value: "strength" },
	{ label: "Endurance", value: "endurance" },
]

export const experienceOptions: Array<{ label: string; value: Experience }> = [
	{ label: "Beginner", value: "beginner" },
	{ label: "Intermediate", value: "intermediate" },
	{ label: "Advanced", value: "advanced" },
]

export const daysOptions = [
	{ label: "2 days", value: "2" },
	{ label: "3 days", value: "3" },
	{ label: "4 days", value: "4" },
	{ label: "5 days", value: "5" },
	{ label: "6 days", value: "6" },
]

export const sessionLengthOptions = [
	{ label: "30 minutes", value: "30" },
	{ label: "45 minutes", value: "45" },
	{ label: "60 minutes", value: "60" },
	{ label: "75 minutes", value: "75" },
	{ label: "90 minutes", value: "90" },
]

export const equipmentOptions: Array<{ label: string; value: Equipment }> = [
	{ label: "Full gym", value: "full_gym" },
	{ label: "Home gym", value: "home_gym" },
	{ label: "Dumbbells only", value: "dumbbells" },
]

export const splitOptions: Array<{ label: string; value: PreferredSplit }> = [
	{ label: "Full body", value: "full_body" },
	{ label: "Upper/Lower", value: "upper_lower" },
	{ label: "Push/Pull/Legs", value: "push_pull_legs" },
	{ label: "Custom", value: "custom" },
]

export const onboardingDefaults = {
	goal: "bulk",
	experience: "beginner",
	daysPerWeek: "3",
	sessionLength: "60",
	equipment: "full_gym",
	preferredSplit: "full_body",
	injuries: "",
} as const
