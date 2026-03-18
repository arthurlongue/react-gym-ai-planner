import { Calendar, Dumbbell, Loader2, RefreshCcw, Target, TrendingUp } from "lucide-react"
import { useState } from "react"
import { Navigate } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { Card } from "../../components/ui/Card"
import { useAuth } from "../../context/AuthContext"
import { PlanDisplay } from "./PlanDisplay"

function formatDate(dateString: string) {
	return new Date(dateString).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	})
}

export default function ProfilePage() {
	const { user, isLoading, plan, generatePlan } = useAuth()
	const [error, setError] = useState("")
	const [isRegenerating, setIsRegenerating] = useState(false)

	if (!user && !isLoading) {
		return <Navigate to="/auth/sign-in" replace />
	}

	if (isLoading) {
		return (
			<div className="page-center">
				<div className="loading-spinner" />
			</div>
		)
	}

	if (!plan) {
		return <Navigate to="/onboarding" replace />
	}

	async function handleRegenerate() {
		setError("")
		setIsRegenerating(true)

		try {
			await generatePlan()
		} catch (regenError) {
			setError(regenError instanceof Error ? regenError.message : "Failed to regenerate plan")
		} finally {
			setIsRegenerating(false)
		}
	}

	return (
		<div className="page-container">
			<div className="container-md">
				<div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
					<div>
						<h1 className="mb-1 font-bold text-3xl">Your Training Plan</h1>
						<p className="text-muted">
							Version {plan.version} • Created {formatDate(plan.createdAt)}
						</p>
					</div>

					<Button
						variant="secondary"
						className="gap-2"
						onClick={handleRegenerate}
						disabled={isRegenerating}
					>
						{isRegenerating ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<RefreshCcw className="h-4 w-4" />
						)}
						{isRegenerating ? "Regenerating..." : "Regenerate Plan"}
					</Button>
				</div>

				{error && (
					<Card variant="bordered" className="mb-6 border-red-500/30 bg-red-500/5 text-red-200">
						<p className="font-medium text-sm">Unable to regenerate your plan</p>
						<p className="mt-1 text-red-100/80 text-sm">{error}</p>
					</Card>
				)}

				<div className="mb-8 grid gap-4 md:grid-cols-4">
					<Card variant="bordered" className="flex items-center gap-3">
						<div className="icon-container">
							<Target className="h-5 w-5 text-accent" />
						</div>
						<div>
							<p className="text-muted text-xs">Goal</p>
							<p className="font-medium text-sm">{plan.plan.overview.goal}</p>
						</div>
					</Card>
					<Card variant="bordered" className="flex items-center gap-3">
						<div className="icon-container">
							<Calendar className="h-5 w-5 text-accent" />
						</div>
						<div>
							<p className="text-muted text-xs">Frequency</p>
							<p className="font-medium text-sm">{plan.plan.overview.frequency}</p>
						</div>
					</Card>
					<Card variant="bordered" className="flex items-center gap-3">
						<div className="icon-container">
							<Dumbbell className="h-5 w-5 text-accent" />
						</div>
						<div>
							<p className="text-muted text-xs">Split</p>
							<p className="font-medium text-sm">{plan.plan.overview.split}</p>
						</div>
					</Card>
					<Card variant="bordered" className="flex items-center gap-3">
						<div className="icon-container">
							<TrendingUp className="h-5 w-5 text-accent" />
						</div>
						<div>
							<p className="text-muted text-xs">Version</p>
							<p className="font-medium text-sm">{plan.version}</p>
						</div>
					</Card>
				</div>

				<Card variant="bordered" className="mb-8">
					<h2 className="mb-2 font-semibold text-lg">Program Notes</h2>
					<p className="text-muted text-sm leading-relaxed">{plan.plan.overview.notes}</p>
				</Card>

				<h2 className="mb-4 font-semibold text-xl">Weekly Schedule</h2>
				<PlanDisplay weeklySchedule={plan.plan.weeklySchedule} />

				<Card variant="bordered" className="mb-8">
					<h2 className="mb-2 font-semibold text-lg">Progression Strategy</h2>
					<p className="text-muted text-sm leading-relaxed">{plan.plan.progression}</p>
				</Card>
			</div>
		</div>
	)
}
