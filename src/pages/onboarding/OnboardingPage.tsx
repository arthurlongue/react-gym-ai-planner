import { RedirectToSignIn } from "@neondatabase/neon-js/auth/react"
import type { FormEvent } from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import type { OnboardingFormValues } from "../../types"
import { OnboardingForm } from "./OnboardingForm"
import { onboardingDefaults } from "./onboarding.constants"

export default function OnboardingPage() {
	const { user, isLoading, saveProfile, generatePlan } = useAuth()
	const navigate = useNavigate()
	const [formData, setFormData] = useState<OnboardingFormValues>(onboardingDefaults)
	const [phase, setPhase] = useState<"idle" | "saving" | "generating">("idle")
	const [error, setError] = useState("")

	function updateField(field: keyof OnboardingFormValues, value: string) {
		setFormData((previous) => ({ ...previous, [field]: value }))
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setError("")
		setPhase("saving")

		try {
			if (!user) {
				throw new Error("User must be authenticated to complete onboarding")
			}

			await saveProfile({
				goal: formData.goal,
				experience: formData.experience,
				daysPerWeek: Number(formData.daysPerWeek),
				sessionLength: Number(formData.sessionLength),
				equipment: formData.equipment,
				preferredSplit: formData.preferredSplit,
				injuries: formData.injuries,
			})
			setPhase("generating")
			await generatePlan()
			navigate("/profile")
		} catch (submitError) {
			setError(submitError instanceof Error ? submitError.message : "Failed to save profile")
			setPhase("idle")
		}
	}

	if (!user) {
		if (isLoading) {
			return (
				<div className="page-center">
					<div className="loading-spinner" />
				</div>
			)
		}

		return <RedirectToSignIn />
	}

	return (
		<div className="page-container">
			<div className="container-sm">
				<OnboardingForm
					formData={formData}
					error={error}
					phase={phase}
					onChange={updateField}
					onSubmit={handleSubmit}
				/>
			</div>
		</div>
	)
}
