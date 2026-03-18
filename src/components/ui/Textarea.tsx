import { forwardRef, type TextareaHTMLAttributes } from "react"

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string
	error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className = "", label, error, id, ...props }, ref) => {
		return (
			<div className="flex flex-col gap-1.5">
				{label && (
					<label htmlFor={id} className="font-medium text-foreground text-sm">
						{label}
					</label>
				)}
				<textarea
					ref={ref}
					id={id}
					className={`w-full resize-none rounded-xl border border-border bg-card px-4 py-2.5 text-foreground transition-colors placeholder:text-muted focus:border-accent focus:outline-none ${className}`}
					{...props}
				/>
				{error && <span className="text-red-500 text-sm">{error}</span>}
			</div>
		)
	},
)

Textarea.displayName = "Textarea"
