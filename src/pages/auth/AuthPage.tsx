import { AuthView } from "@neondatabase/neon-js/auth/react"
import { useParams } from "react-router-dom"

export default function AuthPage() {
	const { pathname } = useParams()

	return (
		<div className="page-container flex items-center justify-center">
			<div className="w-full max-w-md">
				<AuthView pathname={pathname} />
			</div>
		</div>
	)
}
