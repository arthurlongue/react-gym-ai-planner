import { NeonAuthUIProvider } from "@neondatabase/neon-js/auth/react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/layout/Navbar"
import AuthProvider from "./context/AuthContext"
import { authClient } from "./lib/auth"
import Account from "./pages/account/AccountPage"
import Auth from "./pages/auth/AuthPage"
import Home from "./pages/home/HomePage"
import Onboarding from "./pages/onboarding/OnboardingPage"
import Profile from "./pages/profile/ProfilePage"

function App() {
	return (
		<NeonAuthUIProvider authClient={authClient} defaultTheme="dark">
			<AuthProvider>
				<BrowserRouter>
					<div className="flex min-h-screen flex-col">
						<Navbar />
						<main className="flex-1">
							<Routes>
								<Route index element={<Home />} />
								<Route path="/onboarding" element={<Onboarding />} />
								<Route path="/profile" element={<Profile />} />
								<Route path="/auth/:pathname" element={<Auth />} />
								<Route path="/account/:pathname" element={<Account />} />
							</Routes>
						</main>
					</div>
				</BrowserRouter>
			</AuthProvider>
		</NeonAuthUIProvider>
	)
}

export default App
