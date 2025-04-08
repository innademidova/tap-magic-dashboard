
/**
 * This file contains TypeScript definitions for the database tables.
 * It can be used alongside the Supabase client for type safety.
 */

export interface User {
  id: string;
  auth_id?: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'customer' | 'admin' | 'superadmin'; // Assuming these are the valid roles from the enum
  created_at?: string;
  updated_at?: string;
  bio?: string;
  industry?: string;
  subject_matter?: string;
  audience?: string;
  usp?: string;
  writing_style?: string;
  keywords?: string[];
}

export interface PRSession {
  id: string;
  session_id: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  datetime?: string;
  bio?: string;
  industry?: string;
  subject_matter?: string;
  audience?: string;
  usp?: string;
  writing_style?: string;
  keywords?: string[];
  summary_content?: string;
}

export interface PRArticle {
  id: string;
  session_id: string;
  title: string;
  author: string;
  content: string;
  url: string;
  status: string;
  confidence_score?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PRBlog {
  id: string;
  article_id: string;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface PRTalkingPoint {
  id: string;
  article_id: string;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface GHLContact {
  id: string;
  location_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address1?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  company_name?: string;
  contact_name?: string;
  website?: string;
  type?: string;
  source?: string;
  assigned_to?: string;
  tags?: any;
  date_added?: string;
  date_updated?: string;
  date_of_birth?: string;
  dnd?: boolean;
  timezone?: string;
  last_activity?: number;
  event_date_time?: string;
  event_location?: string;
  number_of_gamers?: number;
}

export interface BlogContentView {
  blog_content?: string;
  session_id?: string;
}

export interface SessionArticlesBlogsView {
  session_id?: string;
  session_identifier?: string;
  user_id?: string;
  article_id?: string;
  article_title?: string;
  blog_id?: string;
  blog_title?: string;
  blog_body?: string;
  talking_point_id?: string;
  talking_point_content?: string;
}
