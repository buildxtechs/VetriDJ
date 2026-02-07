'use server';

import sql from '@/db';
import { User, UserRole } from '@/lib/types';
import { revalidatePath } from 'next/cache';

import { createAdminClient } from '@/lib/supabase/admin';

function mapRowToUser(row: any): User {
    return {
        id: row.id,
        name: row.full_name,
        email: row.email,
        phone: row.phone,
        role: row.role as UserRole,
        specializations: row.skills || [], // Map schema 'skills' to type 'specializations'
        hourlyRate: Number(row.hourly_rate),
        status: row.is_active ? 'active' : 'inactive', // Map schema 'is_active' to type 'status'
        joinedAt: row.created_at,
        avatar: row.avatar_url,
    };
}

export async function fetchCrewAction() {
    try {
        const rows = await sql`SELECT * FROM profiles ORDER BY full_name ASC`;
        return { success: true, data: rows.map(mapRowToUser) };
    } catch (error) {
        console.error('Fetch Crew Error:', error);
        return { success: false, error: 'Failed to fetch crew' };
    }
}

export async function addCrewAction(data: Partial<User>) {
    try {
        const supabase = createAdminClient();

        // 1. Create user in Supabase Auth (this triggers profile creation via handle_new_user)
        // We use a dummy password that should be reset by the user later usually, 
        // or we could implement a complete invite flow. For now, we set a default.
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
            email: data.email!,
            password: 'tempPassword123!', // In a real app, send an invite email
            email_confirm: true,
            user_metadata: {
                full_name: data.name,
                role: data.role
            }
        });

        if (authError) throw authError;
        if (!authUser.user) throw new Error('User creation failed');

        // 2. Update the automatically created profile with additional details
        // Note: handle_new_user trigger sets id, email, full_name, role.
        // We need to set phone, skills (specializations), hourly_rate, is_active.

        const profileUpdates = {
            phone: data.phone,
            skills: sql.array(data.specializations || []),
            hourly_rate: data.hourlyRate,
            is_active: data.status === 'active'
        };

        const [updatedProfile] = await sql`
            UPDATE profiles 
            SET ${sql(profileUpdates)}
            WHERE id = ${authUser.user.id}
            RETURNING *
        `;

        revalidatePath('/admin/team');
        return { success: true, data: mapRowToUser(updatedProfile) };
    } catch (error) {
        console.error('Add Crew Error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Failed to add crew member' };
    }
}
