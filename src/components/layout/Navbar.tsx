import { UserButton } from "@neondatabase/neon-js/auth/react"
import { Dumbbell } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { Button } from "../ui/Button"

export default function Navbar() {
	const { user } = useAuth()
	return (
		<header className="fixed top-0 right-0 left-0 z-50 border-border border-b bg-background/80 backdrop-blur-md">
			<div className="container-lg flex h-16 items-center justify-between px-6">
				<Link to="/" className="flex items-center gap-2 text-foreground">
					<Dumbbell className="h-6 w-6 text-accent" />
					<span className="font-semibold text-lg">GymAI</span>
				</Link>

				<nav>
					{user ? (
						<>
							<Link to="/profile">
								<Button variant="ghost" size="sm">
									My Plan
								</Button>
							</Link>
							<UserButton className="bg-accent" />
						</>
					) : (
						<>
							<Link to="/auth/sign-in">
								<Button variant="ghost" size="sm">
									Sign In
								</Button>
							</Link>
							<Link to="/auth/sign-up">
								<Button size="sm">Sign Up</Button>
							</Link>
						</>
					)}
				</nav>
			</div>
		</header>
	)
}
