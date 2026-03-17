import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { api } from "../lib/api";
import { authClient } from "../lib/auth";
import type { User, UserProfile } from "../types";

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	saveProfile: (
		profile: Omit<UserProfile, "userId" | "updatedAt">,
	) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
	const [neonUser, setNeonUser] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadUser() {
			try {
				const result = await authClient.getSession();
				if (result && result.data?.user) setNeonUser(result.data.user);
				else setNeonUser(null);
			} catch (err) {
				setNeonUser(null);
			} finally {
				setIsLoading(false);
			}
		}
		loadUser();
	}, []);

	async function saveProfile(
		profileData: Omit<UserProfile, "userId" | "updatedAt">,
	) {
		if (!neonUser) {
			throw new Error("User not authenticated");
		}
		await api.saveProfile(neonUser.id, profileData);
	}

	return (
		<AuthContext.Provider value={{ user: neonUser, isLoading, saveProfile }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
