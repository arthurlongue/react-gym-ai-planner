import { Dumbbell, Info } from "lucide-react"
import { Card } from "../../components/ui/Card"
import type { DaySchedule, Exercise } from "../../types"

function ExerciseRow({ exercise, index }: { exercise: Exercise; index: number }) {
	return (
		<tr className="border-border border-b last:border-0">
			<td className="py-3 pr-4">
				<div className="flex items-start gap-3">
					<span className="w-5 text-muted text-xs">{index + 1}.</span>
					<div>
						<p className="font-medium">{exercise.name}</p>
						{exercise.notes && (
							<p className="mt-0.5 flex items-center gap-1 text-muted text-xs">
								<Info className="h-3 w-3" />
								{exercise.notes}
							</p>
						)}
					</div>
				</div>
			</td>

			<td className="whitespace-nowrap px-4 py-3 text-center">
				<span className="font-medium text-accent">{exercise.sets}</span>
				<span className="text-muted"> x </span>
				<span>{exercise.reps}</span>
			</td>

			<td className="px-4 py-3 text-center">
				<span className="text-muted">{exercise.rest}</span>
			</td>
			<td className="px-4 py-3 text-center">
				<span
					className={`inline-flex h-8 w-8 items-center justify-center rounded-lg font-medium text-sm ${
						exercise.rpe >= 8
							? "bg-red-500/10 text-red-400"
							: exercise.rpe >= 7
								? "bg-yellow-500/10 text-yellow-400"
								: "bg-green-500/10 text-green-400"
					}`}
				>
					{exercise.rpe}
				</span>
			</td>
		</tr>
	)
}

function DayCard({ schedule }: { schedule: DaySchedule }) {
	return (
		<Card variant="bordered" className="overflow-hidden">
			<div className="mb-4 flex items-center justify-between">
				<div>
					<h3 className="font-semibold text-lg">{schedule.day}</h3>
					<p className="text-accent text-sm">{schedule.focus}</p>
				</div>
				<div className="flex items-center gap-2 text-muted text-sm">
					<Dumbbell className="h-4 w-4" />
					<span>{schedule.exercises.length} exercises</span>
				</div>
			</div>

			<div className="-mx-6 overflow-x-auto px-6">
				<table className="w-full text-sm">
					<thead>
						<tr className="text-muted text-xs uppercase tracking-wider">
							<th className="py-2 pr-4 text-left font-medium">Exercise</th>
							<th className="px-4 py-2 font-medium">Sets x Reps</th>
							<th className="px-4 py-2 font-medium">Rest</th>
							<th className="px-4 py-2 font-medium">RPE</th>
						</tr>
					</thead>

					<tbody>
						{schedule.exercises.map((exercise, index) => (
							<ExerciseRow exercise={exercise} index={index} key={exercise.name} />
						))}
					</tbody>
				</table>
			</div>
		</Card>
	)
}

interface PlanDisplayProps {
	weeklySchedule: DaySchedule[]
}

export function PlanDisplay({ weeklySchedule }: PlanDisplayProps) {
	return (
		<div className="mb-8 space-y-6">
			{weeklySchedule.map((schedule) => (
				<DayCard key={schedule.day} schedule={schedule} />
			))}
		</div>
	)
}
