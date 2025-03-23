
import * as constants from '../constants';
import * as bucketUtils from '../bucket-utils';
import * as pathUtils from '../path-utils';
import * as fileOperations from '../file-operations';
import * as storageIndex from '../index';

describe('Storage Index', () => {
  it('should re-export all modules', () => {
    // Check if all constants are re-exported
    for (const key in constants) {
      expect(storageIndex).toHaveProperty(key);
    }
    
    // Check if all bucket utils are re-exported
    for (const key in bucketUtils) {
      expect(storageIndex).toHaveProperty(key);
    }
    
    // Check if all path utils are re-exported
    for (const key in pathUtils) {
      expect(storageIndex).toHaveProperty(key);
    }
    
    // Check if all file operations are re-exported
    for (const key in fileOperations) {
      expect(storageIndex).toHaveProperty(key);
    }
  });
});
