import { forwardRef, type InputHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string
	error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className = "", label, error, id, ...props }, ref) => {
		return (
			<div className="flex flex-col gap-1.5">
				{label && (
					<label htmlFor={id} className="font-medium text-foreground text-sm">
						{label}
					</label>
				)}
				<input
					ref={ref}
					id={id}
					className={`w-full rounded-xl border border-border bg-card px-4 py-2.5 text-foreground transition-colors placeholder:text-muted focus:border-accent focus:outline-none ${className}`}
					{...props}
				/>
				{error && <span className="text-red-500 text-sm">{error}</span>}
			</div>
		)
	},
)

Input.displayName = "Input"
