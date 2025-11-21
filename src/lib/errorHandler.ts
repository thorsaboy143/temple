// Type guard to check if error has a code property
const hasCode = (error: unknown): error is { code: string } => {
  return typeof error === 'object' && error !== null && 'code' in error;
};

// Type guard to check if error has a message property
const hasMessage = (error: unknown): error is { message: string } => {
  return typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: unknown }).message === 'string';
};

// Error handling utility to prevent sensitive information leakage
export const getUserFriendlyError = (error: unknown): string => {
  // Handle Postgres error codes
  if (hasCode(error)) {
    if (error.code === '23505') {
      return 'This entry already exists. Please check your submission.';
    }
    
    if (error.code === '23503') {
      return 'Invalid reference. Please check your data.';
    }
  }
  
  // Handle RLS policy violations
  if (hasMessage(error)) {
    const message = error.message.toLowerCase();
    
    if (message.includes('row-level security') || 
        message.includes('rls') ||
        message.includes('policy')) {
      return 'You do not have permission to perform this action.';
    }
    
    // Handle storage errors
    if (message.includes('storage') || 
        message.includes('bucket')) {
      return 'File upload failed. Please check the file and try again.';
    }
    
    // Handle authentication errors
    if (message.includes('auth') || 
        message.includes('credentials') ||
        message.includes('password')) {
      return 'Authentication failed. Please check your credentials.';
    }
    
    // Handle network errors
    if (message.includes('network') || 
        message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
  }
  
  // Generic fallback
  return 'An unexpected error occurred. Please try again later.';
};
