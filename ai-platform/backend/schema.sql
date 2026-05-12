-- AI Tools Discovery Platform Database Schema

-- 1. Create categories table
CREATE TABLE public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    description TEXT
);

-- 2. Create subcategories table
CREATE TABLE public.subcategories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT
);

-- 3. Create ai_tools table
CREATE TABLE public.ai_tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    short_description TEXT,
    website_url TEXT,
    logo_url TEXT,
    pricing_type TEXT, -- e.g., 'Free', 'Paid', 'Freemium'
    free_tier BOOLEAN DEFAULT false,
    api_available BOOLEAN DEFAULT false,
    mobile_app BOOLEAN DEFAULT false,
    desktop_app BOOLEAN DEFAULT false,
    web_app BOOLEAN DEFAULT true,
    open_source BOOLEAN DEFAULT false,
    beginner_friendly BOOLEAN DEFAULT false,
    commercial_use BOOLEAN DEFAULT false,
    difficulty_level TEXT, -- 'Beginner', 'Intermediate', 'Professional'
    speed_score INTEGER CHECK (speed_score BETWEEN 1 AND 10),
    quality_score INTEGER CHECK (quality_score BETWEEN 1 AND 10),
    popularity_score INTEGER DEFAULT 0,
    active_status BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create tool_categories mapping table
CREATE TABLE public.tool_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tool_id UUID REFERENCES public.ai_tools(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    subcategory_id UUID REFERENCES public.subcategories(id) ON DELETE SET NULL,
    UNIQUE(tool_id, category_id, subcategory_id)
);

-- 5. Create tool_tags table
CREATE TABLE public.tool_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tool_id UUID REFERENCES public.ai_tools(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    UNIQUE(tool_id, tag)
);

-- 6. Create user profiles & preferences
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    name TEXT,
    email TEXT,
    profile_image TEXT,
    subscription_type TEXT DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.user_preferences (
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE PRIMARY KEY,
    preferred_category TEXT,
    budget_preference TEXT,
    skill_level TEXT,
    api_needed BOOLEAN,
    preferred_platform TEXT
);

-- 7. Create user_searches tracking
CREATE TABLE public.user_searches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    query TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create saved_workflows
CREATE TABLE public.saved_workflows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    workflow_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Create favorite_tools
CREATE TABLE public.favorite_tools (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    tool_id UUID REFERENCES public.ai_tools(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, tool_id)
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_searches ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Users can only see their own private data)
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own workflows" ON public.saved_workflows FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites" ON public.favorite_tools FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own searches" ON public.user_searches FOR SELECT USING (auth.uid() = user_id);

-- Tools & Categories are public read-only
ALTER TABLE public.ai_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public tools are viewable by everyone" ON public.ai_tools FOR SELECT USING (true);
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Subcategories are viewable by everyone" ON public.subcategories FOR SELECT USING (true);
