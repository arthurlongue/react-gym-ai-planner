import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react"
import { api } from "../lib/api"
import { authClient } from "../lib/auth"
import type { TrainingPlan, User, UserProfile } from "../types"

interface AuthContextType {
	user: User | null
	plan: TrainingPlan | null
	isLoading: boolean
	saveProfile: (profile: Omit<UserProfile, "userId" | "updatedAt">) => Promise<void>
	generatePlan: () => Promise<void>
	refreshPlan: (userId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export default function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [plan, setPlan] = useState<TrainingPlan | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	const refreshPlan = useCallback(async (userId: string) => {
		if (!userId) {
			setPlan(null)
			return
		}

		try {
			const response = await api.getCurrentPlan({ userId })
			setPlan(response)
		} catch (_error) {
			setPlan(null)
		}
	}, [])

	useEffect(() => {
		let isActive = true

		async function loadSession() {
			try {
				const result = await authClient.getSession()
				if (!isActive) {
					return
				}

				const nextUser = result?.data?.user ? (result.data.user as User) : null
				setUser(nextUser)

				if (nextUser) {
					await refreshPlan(nextUser.id)
				} else {
					setPlan(null)
				}
			} catch (_error) {
				if (isActive) {
					setUser(null)
					setPlan(null)
				}
			} finally {
				if (isActive) {
					setIsLoading(false)
				}
			}
		}

		loadSession()

		return () => {
			isActive = false
		}
	}, [refreshPlan])

	async function saveProfile(profileData: Omit<UserProfile, "userId" | "updatedAt">) {
		if (!user) {
			throw new Error("User must be authenticated to save profile")
		}

		await api.saveProfile({
			userId: user.id,
			...profileData,
		})
		await refreshPlan(user.id)
	}

	async function generatePlan() {
		if (!user) {
			throw new Error("User must be authenticated to generate plan")
		}

		await api.generatePlan({ userId: user.id })
		await refreshPlan(user.id)
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				plan,
				isLoading,
				saveProfile,
				generatePlan,
				refreshPlan,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}
