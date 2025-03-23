
import { generateFilePath } from '../path-utils';

describe('generateFilePath', () => {
  beforeEach(() => {
    // Mock Math.random to return a fixed value
    jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
    // Mock Date.now to return a fixed timestamp
    jest.spyOn(global.Date, 'now').mockReturnValue(1609459200000); // 2021-01-01
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should generate a valid file path with userId and file extension', () => {
    const file = new File(['content'], 'test-file.jpg', { type: 'image/jpeg' });
    const userId = 'user123';
    const bucket = 'test-bucket';
    
    const result = generateFilePath(file, userId, bucket);
    
    expect(result).toContain('user123/');
    expect(result).toContain('.jpg');
    expect(result).toMatch(/user123\/[a-z0-9]+_1609459200000\.jpg/);
  });

  it('should include folder in the path when provided', () => {
    const file = new File(['content'], 'test-file.pdf', { type: 'application/pdf' });
    const userId = 'user123';
    const bucket = 'test-bucket';
    const folder = 'documents';
    
    const result = generateFilePath(file, userId, bucket, folder);
    
    expect(result).toContain('user123/documents/');
    expect(result).toContain('.pdf');
    expect(result).toMatch(/user123\/documents\/[a-z0-9]+_1609459200000\.pdf/);
  });

  it('should handle files without extensions', () => {
    const file = new File(['content'], 'no-extension', { type: 'text/plain' });
    const userId = 'user123';
    const bucket = 'test-bucket';
    
    const result = generateFilePath(file, userId, bucket);
    
    expect(result).toContain('user123/');
    expect(result).toMatch(/user123\/[a-z0-9]+_1609459200000\./);
  });
});
