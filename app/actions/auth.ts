'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// Helper to map usernames to emails (since Supabase auth uses email)
const getEmailForUsername = (username: string) => {
    const normalized = username.toLowerCase().trim()
    if (normalized === 'admin') return 'admin@vetri.event'
    if (normalized === 'crew') return 'crew@vetri.event'
    // For created crew members, we might use a pattern or look them up
    // For now, let's assume we append @vetri.event for simple username mapping
    return `${normalized}@vetri.event`
}

export async function loginAction(formData: FormData) {
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    if (!username || !password) {
        return { error: 'Username and password are required' }
    }

    const email = getEmailForUsername(username)
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error('Login error:', error)
        return { error: 'Invalid credentials' }
    }

    // Check role to redirect appropriately
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        // Assuming we store role in metadata or profiles table
        // For now, simple redirect based on username or role check
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role === 'ADMIN') {
            redirect('/admin')
        } else if (profile?.role === 'CREW') {
            redirect('/crew')
        } else {
            redirect('/')
        }
    }

    return { success: true }
}

export async function createCrewUser(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    // This action needs to be run by an Admin
    // In a real app we'd use the Service Role key or verify current user is Admin
    // For simplicity, we'll try to create a user. 
    // Note: Creating users usually requires service_role key if doing it via API without simple signup

    // For this demo, let's assume we use a specialized Supabase admin client if available, 
    // or we just use the signup flow but 'auto-confirm' isn't on by default.
    // Better approach for Admin creating users: Use a Database Function or Edge Function, 
    // or just use public signup and assume only Admin knows the URL?
    // Let's stub this for now or unimplemented until we see 'lib/supabase/admin.ts'

    return { error: 'Not implemented' }
}
