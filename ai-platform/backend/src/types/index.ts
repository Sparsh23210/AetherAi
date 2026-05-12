export interface AITool {
  id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  website_url: string;
  logo_url?: string;
  pricing_type: 'Free' | 'Freemium' | 'Paid' | 'Paid API';
  free_tier: boolean;
  api_available: boolean;
  mobile_app: boolean;
  desktop_app: boolean;
  web_app: boolean;
  quality_score: number;
  speed_score: number;
  popularity_score: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}
