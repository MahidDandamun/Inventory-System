export const INVOICE_STATUS_VALUES = ["DRAFT", "ISSUED", "PARTIALLY_PAID", "PAID", "OVERDUE", "VOID"] as const;

export type InvoiceStatus = (typeof INVOICE_STATUS_VALUES)[number];

export const INVOICE_STATUS_FLOW: Record<InvoiceStatus, InvoiceStatus[]> = {
	DRAFT: ["ISSUED", "VOID"],
	ISSUED: ["PARTIALLY_PAID", "PAID", "OVERDUE", "VOID"],
	PARTIALLY_PAID: ["PARTIALLY_PAID", "PAID", "OVERDUE", "VOID"],
	PAID: [],
	OVERDUE: ["PARTIALLY_PAID", "PAID", "VOID"],
	VOID: [],
};

export function getAllowedInvoiceStatuses(currentStatus: InvoiceStatus): InvoiceStatus[] {
	return [currentStatus, ...INVOICE_STATUS_FLOW[currentStatus]];
}

export function canTransitionInvoiceStatus(from: InvoiceStatus, to: InvoiceStatus): boolean {
	if (from === to) return true;
	return INVOICE_STATUS_FLOW[from].includes(to);
}

export function deriveInvoiceStatusFromPayments(input: {
	currentStatus: InvoiceStatus;
	totalAmount: number;
	paidAmount: number;
	dueDate: Date | null;
	asOf?: Date;
}): InvoiceStatus {
	const asOf = input.asOf ?? new Date();

	if (input.currentStatus === "VOID") return "VOID";
	if (input.paidAmount >= input.totalAmount) return "PAID";
	if (input.paidAmount > 0) return "PARTIALLY_PAID";
	if (input.currentStatus === "DRAFT") return "DRAFT";
	if (input.dueDate && input.dueDate < asOf) return "OVERDUE";
	return "ISSUED";
}
