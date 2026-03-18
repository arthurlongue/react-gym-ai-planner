import { forwardRef, type SelectHTMLAttributes } from "react"

interface SelectOption {
	value: string
	label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	label?: string
	error?: string
	options: readonly SelectOption[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	({ className = "", label, error, id, options, ...props }, ref) => {
		return (
			<div className="flex flex-col gap-1.5">
				{label && (
					<label htmlFor={id} className="font-medium text-foreground text-sm">
						{label}
					</label>
				)}
				<select
					ref={ref}
					id={id}
					className={`w-full cursor-pointer rounded-xl border border-border bg-card px-4 py-2.5 text-foreground transition-colors focus:border-accent focus:outline-none ${className}`}
					{...props}
				>
					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
				{error && <span className="text-red-500 text-sm">{error}</span>}
			</div>
		)
	},
)

Select.displayName = "Select"
