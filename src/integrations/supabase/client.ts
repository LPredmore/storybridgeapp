// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hyiyuhjabjnksjbqfwmn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5aXl1aGphYmpua3NqYnFmd21uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI0NTU1NjEsImV4cCI6MjA0ODAzMTU2MX0.hE2rTn4kMe34WfKgiizQQ9t1MLWVQuKJt-7r8v2M3ZE";

// Helper function to detect TWA safely - moved outside of configuration
const detectTWA = (): boolean => {
  try {
    // Safe TWA detection that doesn't run during SSR
    if (typeof window === 'undefined') return false;
    
    const userAgent = navigator.userAgent || '';
    const isTWAUserAgent = userAgent.includes('wv') && userAgent.includes('Chrome');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const hasAndroidInterface = 'Android' in window;
    const hasTWAInterface = 'TWA' in window;
    const referrer = document.referrer || '';
    const isTWAReferrer = referrer.includes('android-app://');
    
    return isTWAUserAgent || isStandalone || hasAndroidInterface || hasTWAInterface || isTWAReferrer;
  } catch (error) {
    console.warn('TWA detection failed:', error);
    return false;
  }
};

// Configure auth options for enhanced session persistence
const authOptions = {
  auth: {
    // Always persist sessions, especially important for TWA
    persistSession: true,
    // Enhanced localStorage implementation for TWA compatibility
    storage: {
      getItem: (key: string) => {
        try {
          const value = localStorage.getItem(key);
          return value;
        } catch (error) {
          console.warn('Auth storage getItem error:', error);
          return null;
        }
      },
      setItem: (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.warn('Auth storage setItem error:', error);
        }
      },
      removeItem: (key: string) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn('Auth storage removeItem error:', error);
        }
      }
    },
    // Enhanced token refresh for TWA and mobile environments
    autoRefreshToken: true,
    // Detect session in URL for all environments
    detectSessionInUrl: true,
    // Use PKCE flow for enhanced security
    flowType: 'pkce' as const,
    // Reduce token refresh margin for faster recovery
    debug: false
  }
};

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, authOptions);