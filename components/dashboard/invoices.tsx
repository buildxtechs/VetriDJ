'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

const MOCK_INVOICES = [
    { id: 'INV-001', client: 'John Doe', amount: 25000, date: '2024-10-15', status: 'PAID' },
    { id: 'INV-002', client: 'Corporate Event A', amount: 150000, date: '2024-10-18', status: 'UNPAID' },
    { id: 'INV-003', client: 'Wedding B', amount: 85000, date: '2024-10-20', status: 'PAID' },
]

export function RecentInvoices() {

    const handleDownload = (id: string) => {
        // In a real app, this would trigger a PDF generation or fetch a file
        alert(`Downloading PDF for Invoice ${id}`)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>Latest transactions and download options.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {MOCK_INVOICES.map((inv) => (
                        <div key={inv.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                                <p className="font-medium">{inv.client}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <span>{inv.id}</span>
                                    <span>•</span>
                                    <span>₹{inv.amount.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${inv.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {inv.status}
                                </span>
                                <Button variant="ghost" size="icon" onClick={() => handleDownload(inv.id)}>
                                    <Download className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
