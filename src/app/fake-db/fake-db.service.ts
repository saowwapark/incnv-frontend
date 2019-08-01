import { InMemoryDbService } from 'angular-in-memory-web-api';
import { UploadsFakeDb } from './uploads';
import { SampleSetsFakeDb } from './samplesets';

export class FakeDbService implements InMemoryDbService {
  createDb(): any {
    return {
      // Uploads
      'uploads-uploads': UploadsFakeDb.UPLOAD_FILES,

      // Sample Sets
      'samplesets-samplesets': SampleSetsFakeDb.SAMPLE_SETS
    };
  }
}
