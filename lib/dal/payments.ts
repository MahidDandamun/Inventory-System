import "server-only";

import { prisma } from "@/lib/prisma";
import { requireCurrentUser } from "@/lib/dal/guards";
import { createSystemLog } from "@/lib/dal/system-logs";
import { canTransitionInvoiceStatus, deriveInvoiceStatusFromPayments, type InvoiceStatus } from "@/lib/invoice-status";

export type PaymentDTO = {
	id: string;
	invoiceId: string;
	amount: number;
	method: string;
	reference: string | null;
	paidAt: Date;
};

function decimalToNumber(value: unknown): number {
	if (typeof value === "number") return value;
	if (typeof value === "string") return Number(value);
	if (value && typeof (value as { toNumber?: () => number }).toNumber === "function") {
		return (value as { toNumber: () => number }).toNumber();
	}
	return Number(value);
}

function toPaymentDTO(payment: {
	id: string;
	invoiceId: string;
	amount: unknown;
	method: string;
	reference: string | null;
	paidAt: Date;
}): PaymentDTO {
	return {
		id: payment.id,
		invoiceId: payment.invoiceId,
		amount: decimalToNumber(payment.amount),
		method: payment.method,
		reference: payment.reference,
		paidAt: payment.paidAt,
	};
}

export async function recordPayment(data: {
	invoiceId: string;
	amount: number;
	method: string;
	reference?: string;
	paidAt?: Date;
}): Promise<PaymentDTO> {
	const user = await requireCurrentUser();

	const { payment, previousStatus, nextStatus } = await prisma.$transaction(async (tx) => {
		const invoice = await tx.invoice.findUnique({
			where: { id: data.invoiceId },
			include: { payments: true },
		});

		if (!invoice) throw new Error("Invoice not found");
		if (invoice.status === "VOID") throw new Error("Cannot record payments on a void invoice");

		const payment = await tx.payment.create({
			data: {
				invoiceId: data.invoiceId,
				amount: data.amount,
				method: data.method,
				reference: data.reference ?? null,
				paidAt: data.paidAt ?? new Date(),
			},
		});

		const totalAmount = decimalToNumber(invoice.total);
		const existingPaidAmount = invoice.payments.reduce((sum, item) => sum + decimalToNumber(item.amount), 0);
		const paidAmount = existingPaidAmount + decimalToNumber(payment.amount);

		const nextStatus = deriveInvoiceStatusFromPayments({
			currentStatus: invoice.status as InvoiceStatus,
			totalAmount,
			paidAmount,
			dueDate: invoice.dueDate,
			asOf: payment.paidAt,
		});

		if (!canTransitionInvoiceStatus(invoice.status as InvoiceStatus, nextStatus)) {
			throw new Error(`Invalid status transition: ${invoice.status} -> ${nextStatus}`);
		}

		if (invoice.status !== nextStatus) {
			await tx.invoice.update({
				where: { id: invoice.id },
				data: { status: nextStatus },
			});
		}

		return {
			payment,
			previousStatus: invoice.status,
			nextStatus,
		};
	});

	await createSystemLog(user.id, "CREATE", "PAYMENT", payment.id, JSON.stringify(data));

	if (previousStatus !== nextStatus) {
		await createSystemLog(
			user.id,
			"UPDATE",
			"INVOICE",
			data.invoiceId,
			JSON.stringify({ previousStatus, nextStatus, source: "recordPayment" }),
		);
	}

	return toPaymentDTO(payment);
}
