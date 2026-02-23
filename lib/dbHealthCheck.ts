import { supabase } from './supabase';

let lastHealthCheck: number = 0;
let isHealthy: boolean = true;
const HEALTH_CHECK_INTERVAL = 60 * 1000; // 1 minute

export async function checkDatabaseHealth(): Promise<boolean> {
  const now = Date.now();
  
  // Return cached health status if checked recently
  if (now - lastHealthCheck < HEALTH_CHECK_INTERVAL) {
    return isHealthy;
  }
  
  try {
    // Simple query to check connection
    const { error } = await supabase
      .from('properties')
      .select('id')
      .limit(1);
    
    isHealthy = !error;
    lastHealthCheck = now;
    
    if (!isHealthy) {
      console.error('[DB Health] Database connection unhealthy:', error);
    }
    
    return isHealthy;
  } catch (error: any) {
    console.error('[DB Health] Health check failed:', error);
    isHealthy = false;
    lastHealthCheck = now;
    return false;
  }
}

export function getDatabaseErrorMessage(error: any): string {
  const errorMessage = error?.message || String(error);
  
  // Check for common Supabase errors
  if (errorMessage.includes('AbortError') || errorMessage.includes('timeout')) {
    return 'Database connection timed out. Your Supabase project may be paused. Please check your Supabase dashboard and restore the project if needed.';
  }
  
  if (errorMessage.includes('JWT') || errorMessage.includes('expired')) {
    return 'Authentication token expired. Please refresh the page and try again.';
  }
  
  if (errorMessage.includes('permission') || errorMessage.includes('policy')) {
    return 'Permission denied. Please check your access rights.';
  }
  
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 'Network error. Please check your internet connection.';
  }
  
  return errorMessage;
}

export async function withHealthCheck<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<T> {
  try {
    // Check health before operation
    const healthy = await checkDatabaseHealth();
    
    if (!healthy && fallback !== undefined) {
      console.warn('[DB Health] Database unhealthy, returning fallback');
      return fallback;
    }
    
    return await operation();
  } catch (error: any) {
    console.error('[DB Health] Operation failed:', error);
    
    // Mark as unhealthy
    isHealthy = false;
    lastHealthCheck = Date.now();
    
    if (fallback !== undefined) {
      return fallback;
    }
    
    throw error;
  }
}
