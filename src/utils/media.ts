/**
 * Video URL'sinin yerel mi yoksa uzak mı olduğunu kontrol eder
 * @param url Video URL'si
 * @returns boolean
 */
export const isLocalVideo = (url: string): boolean => {
  return url.startsWith('data:') ||
    url.startsWith('blob:') ||
    url.startsWith('file:');
}; 