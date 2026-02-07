'use client'

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

interface WhatsAppButtonProps {
    phoneNumber?: string
    message?: string
    label?: string // Optional label text
}

export function WhatsAppButton({
    phoneNumber = "9025407533", // Default business number
    message = "Hello, I need an update on my status.",
    label = "Update Status via WhatsApp"
}: WhatsAppButtonProps) {

    const handleClick = () => {
        const encodedMessage = encodeURIComponent(message)
        const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
        window.open(url, '_blank')
    }

    return (
        <Button
            onClick={handleClick}
            className="bg-[#25D366] hover:bg-[#128C7E] text-white"
        >
            <MessageCircle className="mr-2 h-4 w-4" />
            {label}
        </Button>
    )
}
