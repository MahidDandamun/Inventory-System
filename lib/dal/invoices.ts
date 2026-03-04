import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { createSystemLog } from "@/lib/dal/system-logs";
import { requireCurrentUser } from "@/lib/dal/guards";
import { createWithUniqueRetry, generateDocumentNumber } from "@/lib/document-number";
import { canTransitionInvoiceStatus, deriveInvoiceStatusFromPayments, type InvoiceStatus } from "@/lib/invoice-status";
import type { Invoice, Payment } from "@prisma/client";

export type PaymentDTO = {
	id: string;
	invoiceId: string;
	amount: number;
	method: string;
	reference: string | null;
	paidAt: Date;
};

export type InvoiceDTO = {
	id: string;
	invoiceNo: string;
	orderNo: string;
	customer: string;
	total: number;
	status: InvoiceStatus;
	dueDate: Date | null;
	paidAmount: number;
	balance: number;
	isOverdue: boolean;
	createdAt: Date;
};

export type InvoiceDetailDTO = InvoiceDTO & {
	orderId: string;
	payments: PaymentDTO[];
};

function decimalToNumber(value: unknown): number {
	if (typeof value === "number") return value;
	if (typeof value === "string") return Number(value);
	if (value && typeof (value as { toNumber?: () => number }).toNumber === "function") {
		return (value as { toNumber: () => number }).toNumber();
	}
	return Number(value);
}

function toPaymentDTO(payment: Payment): PaymentDTO {
	return {
		id: payment.id,
		invoiceId: payment.invoiceId,
		amount: decimalToNumber(payment.amount),
		method: payment.method,
		reference: payment.reference,
		paidAt: payment.paidAt,
	};
}

function sumPaidAmount(payments: Payment[]): number {
	return payments.reduce((sum, payment) => sum + decimalToNumber(payment.amount), 0);
}

export function toInvoiceDTO(
	invoice: Invoice & {
		order: { orderNo: string; customerName: string | null; customerRef?: { name: string } | null };
		payments: Payment[];
	},
): InvoiceDTO {
	const total = decimalToNumber(invoice.total);
	const paidAmount = sumPaidAmount(invoice.payments);
	const balance = Math.max(0, total - paidAmount);
	const derivedStatus = deriveInvoiceStatusFromPayments({
		currentStatus: invoice.status as InvoiceStatus,
		totalAmount: total,
		paidAmount,
		dueDate: invoice.dueDate,
	});

	return {
		id: invoice.id,
		invoiceNo: invoice.invoiceNo,
		orderNo: invoice.order.orderNo,
		customer: invoice.order.customerRef?.name || invoice.order.customerName || "",
		total,
		status: derivedStatus,
		dueDate: invoice.dueDate,
		paidAmount,
		balance,
		isOverdue: derivedStatus === "OVERDUE",
		createdAt: invoice.createdAt,
	};
}

export function toInvoiceDetailDTO(
	invoice: Invoice & {
		order: { orderNo: string; customerName: string | null; customerRef?: { name: string } | null };
		payments: Payment[];
	},
): InvoiceDetailDTO {
	return {
		...toInvoiceDTO(invoice),
		orderId: invoice.orderId,
		payments: invoice.payments
			.slice()
			.sort((a, b) => b.paidAt.getTime() - a.paidAt.getTime())
			.map((payment) => toPaymentDTO(payment)),
	};
}

export const getInvoices = cache(async (): Promise<InvoiceDTO[]> => {
	await requireCurrentUser();

	const invoices = await prisma.invoice.findMany({
		include: {
			order: { select: { orderNo: true, customerName: true, customerRef: { select: { name: true } } } },
			payments: true,
		},
		orderBy: { createdAt: "desc" },
	});

	return invoices.map((inv) => toInvoiceDTO(inv));
});

export async function getInvoiceById(id: string): Promise<InvoiceDetailDTO | null> {
	await requireCurrentUser();

	const inv = await prisma.invoice.findUnique({
		where: { id },
		include: {
			order: { select: { orderNo: true, customerName: true, customerRef: { select: { name: true } } } },
			payments: true,
		},
	});
	if (!inv) return null;

	return toInvoiceDetailDTO(inv);
}

export async function createInvoice(data: {
	orderId: string;
	dueDate?: Date | null;
	status?: InvoiceStatus;
}): Promise<InvoiceDetailDTO> {
	const user = await requireCurrentUser();

	const order = await prisma.order.findUnique({ where: { id: data.orderId } });
	if (!order) throw new Error("Order not found");

	const invoice = await createWithUniqueRetry(() =>
		prisma.invoice.create({
			data: {
				invoiceNo: generateDocumentNumber("INV"),
				orderId: data.orderId,
				total: order.total,
				dueDate: data.dueDate ?? null,
				status: data.status ?? "DRAFT",
				createdById: user.id,
			},
			include: {
				order: { select: { orderNo: true, customerName: true, customerRef: { select: { name: true } } } },
				payments: true,
			},
		}),
	);

	await createSystemLog(user.id, "CREATE", "INVOICE", invoice.id, JSON.stringify(data));
	return toInvoiceDetailDTO(invoice);
}

export async function updateInvoice(
	id: string,
	data: { dueDate?: Date | null; status?: InvoiceStatus },
): Promise<InvoiceDetailDTO> {
	const user = await requireCurrentUser();

	const existing = await prisma.invoice.findUnique({
		where: { id },
		include: {
			payments: true,
		},
	});

	if (!existing) {
		throw new Error("Invoice not found");
	}

	if (data.status && !canTransitionInvoiceStatus(existing.status as InvoiceStatus, data.status)) {
		throw new Error(`Invalid status transition: ${existing.status} -> ${data.status}`);
	}

	const dueDate = data.dueDate === undefined ? existing.dueDate : data.dueDate;
	const total = decimalToNumber(existing.total);
	const paidAmount = sumPaidAmount(existing.payments);

	const nextStatus =
		data.status ??
		deriveInvoiceStatusFromPayments({
			currentStatus: existing.status as InvoiceStatus,
			totalAmount: total,
			paidAmount,
			dueDate,
		});

	const invoice = await prisma.invoice.update({
		where: { id },
		data: {
			dueDate,
			status: nextStatus,
		},
		include: {
			order: { select: { orderNo: true, customerName: true, customerRef: { select: { name: true } } } },
			payments: true,
		},
	});

	await createSystemLog(user.id, "UPDATE", "INVOICE", id, JSON.stringify(data));
	return toInvoiceDetailDTO(invoice);
}

export async function deleteInvoice(id: string): Promise<InvoiceDetailDTO> {
	const user = await requireCurrentUser();

	const invoice = await prisma.invoice.delete({
		where: { id },
		include: {
			order: { select: { orderNo: true, customerName: true, customerRef: { select: { name: true } } } },
			payments: true,
		},
	});
	await createSystemLog(user.id, "DELETE", "INVOICE", id);
	return toInvoiceDetailDTO(invoice);
}
