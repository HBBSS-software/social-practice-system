import { ArrowDown, ArrowUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type {
	ClassSummary,
	CreatedUser,
	StudentWithClassSummary,
} from "@/lib/types";

export const comboboxPageSize = 50;

export type CredentialsResult = {
	users: CreatedUser[];
	credentialsCsv: string;
};

export function AdminPageFrame({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="min-w-0 space-y-5 sm:space-y-6">
			<div className="space-y-2">
				<h1 className="text-xl font-bold tracking-tight sm:text-2xl">
					{title}
				</h1>
				{description ? (
					<p className="max-w-3xl text-sm text-muted-foreground">
						{description}
					</p>
				) : null}
			</div>
			{children}
		</div>
	);
}

export function Field({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<div className="space-y-2">
			<Label>{label}</Label>
			{children}
		</div>
	);
}

export function SelectClass({
	classes,
	value,
	disabled,
	onChange,
}: {
	classes: ClassSummary[];
	value: number | null;
	disabled?: boolean;
	onChange: (value: number | null) => void;
}) {
	return (
		<Field label="班级">
			<Select
				value={value ? String(value) : "__none__"}
				disabled={disabled}
				onValueChange={(nextValue) =>
					onChange(nextValue === "__none__" ? null : Number(nextValue))
				}
			>
				<SelectTrigger className="w-full">
					<SelectValue placeholder="班级" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="__none__">不分配班级</SelectItem>
					{classes.map((item) => (
						<SelectItem key={item.id} value={String(item.id)}>
							{item.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</Field>
	);
}

export function formatStudentClass(
	student: Pick<StudentWithClassSummary, "class_name">,
) {
	return student.class_name ? (
		student.class_name
	) : (
		<span className="text-muted-foreground">未分配</span>
	);
}

export function getStudentClassSortValue(
	student: Pick<StudentWithClassSummary, "class_name">,
) {
	return student.class_name ?? null;
}

export function compareStudentClass(
	left: Pick<StudentWithClassSummary, "class_name" | "uid">,
	right: Pick<StudentWithClassSummary, "class_name" | "uid">,
	direction: "asc" | "desc",
) {
	const leftClass = getStudentClassSortValue(left);
	const rightClass = getStudentClassSortValue(right);

	if (!leftClass && !rightClass) return left.uid - right.uid;
	if (!leftClass) return 1;
	if (!rightClass) return -1;

	const result = leftClass.localeCompare(rightClass) || left.uid - right.uid;
	return direction === "asc" ? result : -result;
}

export function SortButton({
	active,
	descending,
	label,
	onClick,
}: {
	active: boolean;
	descending: boolean;
	label: string;
	onClick: () => void;
}) {
	return (
		<button
			className="inline-flex items-center gap-1 [font-weight:inherit]"
			type="button"
			onClick={onClick}
		>
			{label}
			{active ? (
				descending ? (
					<ArrowDown className="size-3.5" />
				) : (
					<ArrowUp className="size-3.5" />
				)
			) : null}
		</button>
	);
}
