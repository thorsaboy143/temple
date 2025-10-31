// Error handling utility to prevent sensitive information leakage
export const getUserFriendlyError = (error: any): string => {
  // Handle Postgres error codes
  if (error.code === '23505') {
    return 'This entry already exists. Please check your submission.';
  }
  
  if (error.code === '23503') {
    return 'Invalid reference. Please check your data.';
  }
  
  // Handle RLS policy violations
  if (error.message?.toLowerCase().includes('row-level security') || 
      error.message?.toLowerCase().includes('rls') ||
      error.message?.toLowerCase().includes('policy')) {
    return 'You do not have permission to perform this action.';
  }
  
  // Handle storage errors
  if (error.message?.toLowerCase().includes('storage') || 
      error.message?.toLowerCase().includes('bucket')) {
    return 'File upload failed. Please check the file and try again.';
  }
  
  // Handle authentication errors
  if (error.message?.toLowerCase().includes('auth') || 
      error.message?.toLowerCase().includes('credentials') ||
      error.message?.toLowerCase().includes('password')) {
    return 'Authentication failed. Please check your credentials.';
  }
  
  // Handle network errors
  if (error.message?.toLowerCase().includes('network') || 
      error.message?.toLowerCase().includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  // Generic fallback
  return 'An unexpected error occurred. Please try again later.';
};
