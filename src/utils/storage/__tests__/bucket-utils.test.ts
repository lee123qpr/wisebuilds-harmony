
import { checkBucketExists, getActualAvatarBucket, ensureBucketExists } from '../bucket-utils';
import { supabase } from '@/integrations/supabase/client';

// Mock the Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    storage: {
      listBuckets: jest.fn(),
      createBucket: jest.fn()
    }
  }
}));

describe('Bucket Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkBucketExists', () => {
    it('should return true when bucket exists', async () => {
      const mockBuckets = [{ name: 'test-bucket' }, { name: 'avatar' }];
      (supabase.storage.listBuckets as jest.Mock).mockResolvedValue({ 
        data: mockBuckets, 
        error: null 
      });

      const result = await checkBucketExists('avatar');
      
      expect(result).toBe(true);
      expect(supabase.storage.listBuckets).toHaveBeenCalledTimes(1);
    });

    it('should return false when bucket does not exist', async () => {
      const mockBuckets = [{ name: 'other-bucket' }];
      (supabase.storage.listBuckets as jest.Mock).mockResolvedValue({ 
        data: mockBuckets, 
        error: null 
      });

      const result = await checkBucketExists('avatar');
      
      expect(result).toBe(false);
      expect(supabase.storage.listBuckets).toHaveBeenCalledTimes(1);
    });

    it('should return false when there is an error', async () => {
      (supabase.storage.listBuckets as jest.Mock).mockResolvedValue({ 
        data: null, 
        error: { message: 'Access denied' } 
      });

      const result = await checkBucketExists('avatar');
      
      expect(result).toBe(false);
      expect(supabase.storage.listBuckets).toHaveBeenCalledTimes(1);
    });

    it('should return false when an exception is thrown', async () => {
      (supabase.storage.listBuckets as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      const result = await checkBucketExists('avatar');
      
      expect(result).toBe(false);
      expect(supabase.storage.listBuckets).toHaveBeenCalledTimes(1);
    });
  });

  describe('getActualAvatarBucket', () => {
    it('should return the primary avatar bucket when it exists', async () => {
      const mockBuckets = [{ name: 'avatar' }, { name: 'other-bucket' }];
      (supabase.storage.listBuckets as jest.Mock).mockResolvedValue({ 
        data: mockBuckets, 
        error: null 
      });

      const result = await getActualAvatarBucket();
      
      expect(result).toBe('avatar');
    });

    it('should return first fallback bucket when primary does not exist', async () => {
      const mockBuckets = [
        { name: 'other-bucket' }, 
        { name: 'freelancer-avatar' }
      ];
      (supabase.storage.listBuckets as jest.Mock).mockResolvedValue({ 
        data: mockBuckets, 
        error: null 
      });

      const result = await getActualAvatarBucket();
      
      expect(result).toBe('freelancer-avatar');
    });

    it('should return the first available bucket as last resort', async () => {
      const mockBuckets = [
        { name: 'some-bucket' }, 
        { name: 'another-bucket' }
      ];
      (supabase.storage.listBuckets as jest.Mock).mockResolvedValue({ 
        data: mockBuckets, 
        error: null 
      });

      const result = await getActualAvatarBucket();
      
      expect(result).toBe('some-bucket');
    });

    it('should return default value when there is an error', async () => {
      (supabase.storage.listBuckets as jest.Mock).mockResolvedValue({ 
        data: null, 
        error: { message: 'Access denied' } 
      });

      const result = await getActualAvatarBucket();
      
      expect(result).toBe('avatar');
    });

    it('should return default value when an exception is thrown', async () => {
      (supabase.storage.listBuckets as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      const result = await getActualAvatarBucket();
      
      expect(result).toBe('avatar');
    });
  });

  describe('ensureBucketExists', () => {
    it('should return true when bucket already exists', async () => {
      // Mock checkBucketExists to return true
      jest.spyOn(require('../bucket-utils'), 'checkBucketExists')
        .mockResolvedValueOnce(true);

      const result = await ensureBucketExists('test-bucket');
      
      expect(result).toBe(true);
      // Should not attempt to create the bucket
      expect(supabase.storage.createBucket).not.toHaveBeenCalled();
    });

    it('should return false in client-side code', async () => {
      // Mock checkBucketExists to return false
      jest.spyOn(require('../bucket-utils'), 'checkBucketExists')
        .mockResolvedValueOnce(false);

      const result = await ensureBucketExists('new-bucket');
      
      expect(result).toBe(false);
      // Should not attempt to create the bucket in client-side code
      expect(supabase.storage.createBucket).not.toHaveBeenCalled();
    });
  });
});
