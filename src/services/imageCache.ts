import * as FileSystem from 'expo-file-system';

const IMAGE_CACHE_DIR = `${FileSystem.documentDirectory}image_cache/`;

export const ImageCacheService = {
  init: async (): Promise<void> => {
    const dirInfo = await FileSystem.getInfoAsync(IMAGE_CACHE_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(IMAGE_CACHE_DIR, { intermediates: true });
    }
  },

  cacheImage: async (uri: string, taskId: string): Promise<string> => {
    try {
      await ImageCacheService.init();

      // Generate a unique filename based on taskId
      const extension = uri.split('.').pop()?.split('?')[0] || 'jpg';
      const cachedFileName = `${taskId}.${extension}`;
      const cachedUri = `${IMAGE_CACHE_DIR}${cachedFileName}`;

      // Check if already cached
      const fileInfo = await FileSystem.getInfoAsync(cachedUri);
      if (fileInfo.exists) {
        // Delete old cached image
        await FileSystem.deleteAsync(cachedUri, { idempotent: true });
      }

      // Copy the image to cache directory
      await FileSystem.copyAsync({
        from: uri,
        to: cachedUri,
      });

      return cachedUri;
    } catch (error) {
      console.error('Failed to cache image:', error);
      return uri; // Return original URI if caching fails
    }
  },

  getCachedImage: async (taskId: string): Promise<string | null> => {
    try {
      await ImageCacheService.init();

      // Check for common extensions
      const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      for (const ext of extensions) {
        const cachedUri = `${IMAGE_CACHE_DIR}${taskId}.${ext}`;
        const fileInfo = await FileSystem.getInfoAsync(cachedUri);
        if (fileInfo.exists) {
          return cachedUri;
        }
      }
      return null;
    } catch (error) {
      console.error('Failed to get cached image:', error);
      return null;
    }
  },

  deleteCachedImage: async (taskId: string): Promise<void> => {
    try {
      const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      for (const ext of extensions) {
        const cachedUri = `${IMAGE_CACHE_DIR}${taskId}.${ext}`;
        await FileSystem.deleteAsync(cachedUri, { idempotent: true });
      }
    } catch (error) {
      console.error('Failed to delete cached image:', error);
    }
  },

  clearCache: async (): Promise<void> => {
    try {
      await FileSystem.deleteAsync(IMAGE_CACHE_DIR, { idempotent: true });
      await ImageCacheService.init();
    } catch (error) {
      console.error('Failed to clear image cache:', error);
    }
  },

  getCacheSize: async (): Promise<number> => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(IMAGE_CACHE_DIR, { size: true });
      return dirInfo.exists && dirInfo.size ? dirInfo.size : 0;
    } catch (error) {
      console.error('Failed to get cache size:', error);
      return 0;
    }
  },
};
