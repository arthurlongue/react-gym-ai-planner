import { ArrowRight, Loader2 } from "lucide-react"
import type { FormEvent } from "react"
import { Button } from "../../components/ui/Button"
import { Card } from "../../components/ui/Card"
import { Select } from "../../components/ui/Select"
import { Textarea } from "../../components/ui/Textarea"
import type { OnboardingFormValues } from "../../types"
import {
	daysOptions,
	equipmentOptions,
	experienceOptions,
	goalOptions,
	sessionLengthOptions,
	splitOptions,
} from "./onboarding.constants"

interface OnboardingFormProps {
	formData: OnboardingFormValues
	error: string
	phase: "idle" | "saving" | "generating"
	onChange: (field: keyof OnboardingFormValues, value: string) => void
	onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function OnboardingForm({
	formData,
	error,
	phase,
	onChange,
	onSubmit,
}: OnboardingFormProps) {
	if (phase === "generating") {
		return (
			<Card variant="bordered" className="py-16 text-center">
				<Loader2 className="mx-auto mb-6 h-12 w-12 animate-spin text-accent" />
				<h1 className="mb-2 font-bold text-2xl">Creating your Plan</h1>
				<p className="text-muted">Our AI is building your personalized training program. This can take up to 2 minutes.</p>
			</Card>
		)
	}

	const isBusy = phase === "saving"

	return (
		<Card variant="bordered">
			<div className="mb-6">
				<h1 className="mb-2 font-bold text-2xl">Tell Us About Yourself</h1>
				<p className="text-muted">Help us create the perfect plan for you.</p>
			</div>

			{error && (
				<div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200 text-sm">
					{error}
				</div>
			)}

			{isBusy && (
				<div className="mb-6 rounded-xl border border-border bg-card/60 px-4 py-3 text-muted text-sm">
					Saving your profile and preparing your plan...
				</div>
			)}

			<form onSubmit={onSubmit} className="space-y-5">
				<Select
					id="goal"
					label="What's your primary goal?"
					options={goalOptions}
					value={formData.goal}
					disabled={isBusy}
					onChange={(event) => onChange("goal", event.target.value)}
				/>
				<Select
					id="experience"
					label="Training experience"
					options={experienceOptions}
					value={formData.experience}
					disabled={isBusy}
					onChange={(event) => onChange("experience", event.target.value)}
				/>
				<div className="grid grid-cols-2 gap-4">
					<Select
						id="daysPerWeek"
						label="Days per week"
						options={daysOptions}
						value={formData.daysPerWeek}
						disabled={isBusy}
						onChange={(event) => onChange("daysPerWeek", event.target.value)}
					/>
					<Select
						id="sessionLength"
						label="Session length"
						options={sessionLengthOptions}
						value={formData.sessionLength}
						disabled={isBusy}
						onChange={(event) => onChange("sessionLength", event.target.value)}
					/>
				</div>
				<Select
					id="equipment"
					label="Equipment access"
					options={equipmentOptions}
					value={formData.equipment}
					disabled={isBusy}
					onChange={(event) => onChange("equipment", event.target.value)}
				/>
				<Select
					id="preferredSplit"
					label="Preferred training split"
					options={splitOptions}
					value={formData.preferredSplit}
					disabled={isBusy}
					onChange={(event) => onChange("preferredSplit", event.target.value)}
				/>
				<Textarea
					id="injuries"
					label="Any injuries or limitations? (optional)"
					placeholder="E.g., lower back issues, shoulder impingement..."
					rows={3}
					value={formData.injuries}
					disabled={isBusy}
					onChange={(event) => onChange("injuries", event.target.value)}
				/>
				<div className="flex gap-3 pt-2">
					<Button type="submit" className="flex-1 gap-2" disabled={isBusy}>
						Generate My Plan
						<ArrowRight className="h-4 w-4" />
					</Button>
				</div>
			</form>
		</Card>
	)
}
