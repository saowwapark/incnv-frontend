import { TabFileMappingsFakeDb } from './tab-configure';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { UploadsFakeDb } from './uploads';
import { SamplesetsFakeDb } from './samplesets';

export class FakeDbService implements InMemoryDbService {
  createDb(): any {
    return {
      // Uploads
      'uploads-uploads': UploadsFakeDb.UPLOAD_FILES,
      'uploads-sampleset-1': UploadsFakeDb.UPLOAD_FILES_SAMPLESET_1,
      'uploads-sampleset-2': UploadsFakeDb.UPLOAD_FILES_SAMPLESET_2,

      // Configured BED
      fileMappings: TabFileMappingsFakeDb.TAB_MAPPING_CONFIGURED,

      // Sample Sets
      samplesets: SamplesetsFakeDb.SAMPLE_SETS
    };
  }
}
