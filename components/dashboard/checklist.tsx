'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

// Simple mock data for now, eventually fetched from DB
const INITIAL_CHECKLIST = [
    { id: '1', equipment_name: 'Sound Mixer (Yamaha)', status: 'PENDING' },
    { id: '2', equipment_name: 'Wireless Mics (Set of 4)', status: 'PENDING' },
    { id: '3', equipment_name: 'LED Par Cans (x8)', status: 'COMPLETED' },
    { id: '4', equipment_name: 'Subwoofers (x2)', status: 'PENDING' },
]

export function MembeeChecklist() {
    const [items, setItems] = useState(INITIAL_CHECKLIST)

    const toggleItem = (id: string) => {
        setItems(items.map(item =>
            item.id === id
                ? { ...item, status: item.status === 'PENDING' ? 'COMPLETED' : 'PENDING' }
                : item
        ))
        // Here we would call a server action to update the DB
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Membee Equipment Checklist</CardTitle>
                <CardDescription>Track equipment status for upcoming events.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`item-${item.id}`}
                                checked={item.status === 'COMPLETED'}
                                onCheckedChange={() => toggleItem(item.id)}
                            />
                            <Label
                                htmlFor={`item-${item.id}`}
                                className={item.status === 'COMPLETED' ? 'line-through text-muted-foreground' : ''}
                            >
                                {item.equipment_name}
                            </Label>
                        </div>
                    ))}
                    <div className="pt-4">
                        <Button variant="outline" size="sm" onClick={() => console.log('Save triggered')}>
                            Save Changes
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
