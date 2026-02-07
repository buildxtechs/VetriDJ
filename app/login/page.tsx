'use client'

import { useState } from 'react'
// import { loginAction } from '@/app/actions/auth' // We'll hook this up, but for now using client-side handling or importing the server action
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { loginAction } from '@/app/actions/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        try {
            const result = await loginAction(formData)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success('Login successful')
                // Redirect handled by server action usually, but if it returns success we can also refresh
            }
        } catch (error) {
            toast.error('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-black bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#1a1625] to-black">
            {/* Background Animation Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-purple-600/20 blur-3xl lg:h-96 lg:w-96"></div>
                <div className="absolute bottom-1/4 right-1/4 h-64 w-64 animate-pulse rounded-full bg-blue-600/20 blur-3xl lg:h-96 lg:w-96"></div>
            </div>

            <Card className="z-10 w-full max-w-md border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 shadow-lg shadow-purple-500/20">
                            {/* Logo Placeholder */}
                            <span className="text-2xl font-bold text-white">V</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-white">
                        Welcome back
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Enter your credentials to access your dashboard
                    </CardDescription>
                </CardHeader>
                <form action={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-zinc-300">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                placeholder="Admin or Crew"
                                required
                                className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-zinc-300">Password</Label>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="border-zinc-700 bg-zinc-800/50 text-white placeholder:text-zinc-500 focus:border-purple-500 focus:ring-purple-500"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 font-semibold hover:from-purple-500 hover:to-blue-500"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
