/**
 * Utility function to get the full media URL for uploaded files
 */
export const getMediaUrl = (mediaPath: string | null | undefined): string | null => {
  if (!mediaPath) return null;
  
  // If it's already a full URL, return as is
  if (mediaPath.startsWith('http://') || mediaPath.startsWith('https://')) {
    return mediaPath;
  }
  
  // Get the base URL for media files
  const getMediaBaseUrl = () => {
    // If we're in development and using localhost, use localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:8000';
    }
    
    // Otherwise, use the same host as the frontend but port 8000
    return `http://${window.location.hostname}:8000`;
  };
  
  // Ensure the media path starts with /
  const normalizedPath = mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;
  
  return `${getMediaBaseUrl()}${normalizedPath}`;
};
