"use client";

import React from 'react';
import { CreditCard, Check, Clock, AlertCircle, Download, Plus, Filter } from 'lucide-react';

export default function PaymentsPage() {
    // Mock payments data
    const payments = [
        {
            id: 1,
            clientName: "Ananya Sharma",
            amount: 2500,
            date: "2026-01-08",
            type: "Consultation Fee",
            status: "paid",
            method: "UPI"
        },
        {
            id: 2,
            clientName: "Vikram Singh",
            amount: 1500,
            date: "2026-01-05",
            type: "Follow-up Session",
            status: "paid",
            method: "Card"
        },
        {
            id: 3,
            clientName: "Priya Mehta",
            amount: 3500,
            date: "2026-01-03",
            type: "Full Chart Analysis",
            status: "pending",
            method: "—"
        },
        {
            id: 4,
            clientName: "Rahul Verma",
            amount: 5000,
            date: "2025-12-28",
            type: "Yearly Prediction",
            status: "paid",
            method: "Bank Transfer"
        },
    ];

    const getStatusBadge = (status: string) => {
        if (status === "paid") {
            return (
                <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg">
                    <Check className="w-3 h-3" /> Paid
                </span>
            );
        }
        return (
            <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-lg">
                <Clock className="w-3 h-3" /> Pending
            </span>
        );
    };

    const totalReceived = payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0);
    const totalPending = payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gold-primary/10 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-gold-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-ink">Payments</h1>
                        <p className="text-sm text-muted">Track earnings and invoices</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2.5 bg-parchment border border-antique text-body rounded-lg font-medium text-sm hover:bg-softwhite transition-colors flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button className="px-4 py-2.5 bg-gold-primary text-white rounded-lg font-semibold text-sm hover:bg-gold-dark transition-colors flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Record Payment
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-softwhite border border-antique rounded-xl p-4">
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">This Month</p>
                    <p className="text-2xl font-serif font-bold text-ink">₹{totalReceived.toLocaleString()}</p>
                </div>
                <div className="bg-softwhite border border-antique rounded-xl p-4">
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">Pending</p>
                    <p className="text-2xl font-serif font-bold text-orange-600">₹{totalPending.toLocaleString()}</p>
                </div>
                <div className="bg-softwhite border border-antique rounded-xl p-4">
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">Total Clients</p>
                    <p className="text-2xl font-serif font-bold text-ink">{payments.length}</p>
                </div>
            </div>

            {/* Payments Table */}
            <div className="bg-softwhite border border-antique rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-antique bg-parchment/50">
                            <th className="text-left px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Client</th>
                            <th className="text-left px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Type</th>
                            <th className="text-left px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Date</th>
                            <th className="text-left px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Method</th>
                            <th className="text-right px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Amount</th>
                            <th className="text-center px-5 py-3 text-xs font-bold text-muted uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment.id} className="border-b border-antique/50 last:border-0 hover:bg-parchment/30 transition-colors">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gold-primary/10 flex items-center justify-center text-sm font-serif font-bold text-gold-dark">
                                            {payment.clientName.charAt(0)}
                                        </div>
                                        <span className="font-medium text-ink">{payment.clientName}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-sm text-body">{payment.type}</td>
                                <td className="px-5 py-4 text-sm text-muted">{payment.date}</td>
                                <td className="px-5 py-4 text-sm text-muted">{payment.method}</td>
                                <td className="px-5 py-4 text-right font-serif font-bold text-ink">₹{payment.amount.toLocaleString()}</td>
                                <td className="px-5 py-4 text-center">{getStatusBadge(payment.status)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
