import { ArrowRight, Zap } from "lucide-react"
import { Link, Navigate } from "react-router-dom"
import { Button } from "../../components/ui/Button"
import { Card } from "../../components/ui/Card"
import { useAuth } from "../../context/AuthContext"
import { features } from "./constants"

export default function HomePage() {
	const { user, isLoading } = useAuth()

	if (!isLoading && user) {
		return <Navigate to="/profile" replace />
	}

	return (
		<div className="min-h-screen">
			<section className="relative overflow-hidden px-6 pt-32 pb-20">
				<div className="absolute inset-0 bg-linear-to-b from-accent/5 via-transparent to-transparent" />
				<div className="absolute top-1/4 left-1/2 h-200 w-200 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

				<div className="container-lg relative text-center">
					<div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
						<Zap className="h-4 w-4 text-accent" />
						<span className="text-muted text-sm">AI-powered training plans</span>
					</div>

					<h1 className="mb-6 font-bold text-5xl tracking-tight md:text-7xl">
						Your Perfect
						<br />
						<span className="text-accent">Gym Plan</span> in Seconds
					</h1>

					<p className="mx-auto mb-10 max-w-2xl text-muted text-xl">
						Stop guessing. Get a personalized training program built by AI, tailored to your goals,
						experience, and schedule.
					</p>

					<div className="flex flex-col justify-center gap-4 sm:flex-row">
						<Link to="/onboarding">
							<Button size="lg" className="gap-2">
								Get Started Free
								<ArrowRight className="h-5 w-5" />
							</Button>
						</Link>
						<Link to="/onboarding">
							<Button variant="secondary" size="lg">
								Sign In
							</Button>
						</Link>
					</div>
				</div>
			</section>

			<section className="px-6 py-20">
				<div className="container-lg">
					<div className="mb-16 text-center">
						<h2 className="mb-4 font-bold text-3xl md:text-4xl">Why GymAI?</h2>
						<p className="mx-auto max-w-2xl text-lg text-muted">
							We combine fitness expertise with AI to create programs that actually work for you.
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
						{features.map((feature) => (
							<Card
								key={feature.title}
								variant="bordered"
								className="group transition-colors hover:border-accent/50"
							>
								<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 transition-colors group-hover:bg-accent/20">
									<feature.icon className="h-6 w-6 text-accent" />
								</div>
								<h3 className="mb-2 font-semibold text-lg">{feature.title}</h3>
								<p className="text-muted text-sm">{feature.description}</p>
							</Card>
						))}
					</div>
				</div>
			</section>
		</div>
	)
}
