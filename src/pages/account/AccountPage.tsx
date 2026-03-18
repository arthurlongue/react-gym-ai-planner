import { AccountView } from "@neondatabase/neon-js/auth/react"
import { useParams } from "react-router-dom"

export default function AccountPage() {
	const { pathname } = useParams()

	return (
		<div className="page-container">
			<div className="container-md">
				<AccountView pathname={pathname} />
			</div>
		</div>
	)
}
