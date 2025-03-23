
import { uploadFile, removeFile } from '../file-operations';
import { supabase } from '@/integrations/supabase/client';
import { StorageBucket } from '../constants';
import * as bucketUtils from '../bucket-utils';

// Mock the Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn()
    },
    storage: {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn(),
      remove: jest.fn(),
      getPublicUrl: jest.fn(),
      listBuckets: jest.fn()
    }
  }
}));

// Mock the bucket-utils module
jest.mock('../bucket-utils', () => ({
  checkBucketExists: jest.fn(),
  getActualAvatarBucket: jest.fn()
}));

describe('File Operations', () => {
  let mockFile: File;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a mock file
    mockFile = new File(['test content'], 'test-file.jpg', { type: 'image/jpeg' });
    
    // Setup default mock responses
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: { id: 'user123' } } }
    });
    
    (supabase.storage.from as jest.Mock).mockReturnValue({
      upload: jest.fn().mockResolvedValue({ data: { path: 'user123/file.jpg' }, error: null }),
      getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/file.jpg' } }),
      remove: jest.fn().mockResolvedValue({ error: null })
    });
    
    (bucketUtils.checkBucketExists as jest.Mock).mockResolvedValue(true);
    (bucketUtils.getActualAvatarBucket as jest.Mock).mockResolvedValue('avatar');
  });

  describe('uploadFile', () => {
    it('should upload a file successfully', async () => {
      const result = await uploadFile(mockFile, 'user123', StorageBucket.PROJECTS);
      
      expect(result).not.toBeNull();
      expect(result?.url).toBe('https://example.com/file.jpg');
      expect(result?.path).toBe('user123/file.jpg');
      expect(supabase.storage.from).toHaveBeenCalledWith(StorageBucket.PROJECTS);
      expect(supabase.storage.from(StorageBucket.PROJECTS).upload).toHaveBeenCalledTimes(1);
      expect(supabase.storage.from(StorageBucket.PROJECTS).getPublicUrl).toHaveBeenCalledWith('user123/file.jpg');
    });

    it('should use the actual avatar bucket when AVATARS bucket is specified', async () => {
      await uploadFile(mockFile, 'user123', StorageBucket.AVATARS);
      
      expect(bucketUtils.getActualAvatarBucket).toHaveBeenCalledTimes(1);
      expect(supabase.storage.from).toHaveBeenCalledWith('avatar');
    });

    it('should throw an error when user is not authenticated', async () => {
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null }
      });
      
      await expect(uploadFile(mockFile, 'user123', StorageBucket.PROJECTS))
        .rejects.toThrow('Authentication required for file uploads');
    });

    it('should throw an error when bucket does not exist', async () => {
      (bucketUtils.checkBucketExists as jest.Mock).mockResolvedValue(false);
      (supabase.storage.listBuckets as jest.Mock).mockResolvedValue({
        data: [{ name: 'other-bucket' }]
      });
      
      await expect(uploadFile(mockFile, 'user123', StorageBucket.PROJECTS))
        .rejects.toThrow(/Upload failed: Storage bucket.*is not available/);
    });

    it('should throw an error when upload fails', async () => {
      (supabase.storage.from as jest.Mock).mockReturnValue({
        upload: jest.fn().mockResolvedValue({ 
          data: null, 
          error: { message: 'Upload failed' } 
        }),
        getPublicUrl: jest.fn()
      });
      
      await expect(uploadFile(mockFile, 'user123', StorageBucket.PROJECTS))
        .rejects.toThrow('Upload failed');
    });
    
    it('should throw an error when path is not returned', async () => {
      (supabase.storage.from as jest.Mock).mockReturnValue({
        upload: jest.fn().mockResolvedValue({ 
          data: {}, // missing path
          error: null 
        }),
        getPublicUrl: jest.fn()
      });
      
      await expect(uploadFile(mockFile, 'user123', StorageBucket.PROJECTS))
        .rejects.toThrow('Upload failed: No file path returned');
    });
  });

  describe('removeFile', () => {
    it('should remove a file successfully', async () => {
      const result = await removeFile('user123/file.jpg', StorageBucket.PROJECTS);
      
      expect(result).toBe(true);
      expect(supabase.storage.from).toHaveBeenCalledWith(StorageBucket.PROJECTS);
      expect(supabase.storage.from(StorageBucket.PROJECTS).remove).toHaveBeenCalledWith(['user123/file.jpg']);
    });

    it('should return false when there is an error', async () => {
      (supabase.storage.from as jest.Mock).mockReturnValue({
        remove: jest.fn().mockResolvedValue({ 
          error: { message: 'Removal failed' } 
        })
      });
      
      const result = await removeFile('user123/file.jpg', StorageBucket.PROJECTS);
      
      expect(result).toBe(false);
    });

    it('should return false when an exception is thrown', async () => {
      (supabase.storage.from as jest.Mock).mockReturnValue({
        remove: jest.fn().mockRejectedValue(new Error('Network error'))
      });
      
      const result = await removeFile('user123/file.jpg', StorageBucket.PROJECTS);
      
      expect(result).toBe(false);
    });
  });
});
