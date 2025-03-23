
import { StorageBucket } from '../constants';

describe('StorageBucket', () => {
  it('should define the correct bucket names', () => {
    expect(StorageBucket.PROJECTS).toBe('project-documents');
    expect(StorageBucket.ATTACHMENTS).toBe('attachments');
    expect(StorageBucket.AVATARS).toBe('avatar');
    expect(StorageBucket.VERIFICATION).toBe('verification_documents');
  });
});
