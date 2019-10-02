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

      // Configured CNV Tools
      'tab-fileMappings': TabFileMappingsFakeDb.TAB_MAPPINGS,
      'tab-fileMappings-id-name': TabFileMappingsFakeDb.TAB_MAPPINGS_ID_NAME,

      // Sample Sets
      'samplesets-id-name': SamplesetsFakeDb.SAMPLE_SETS_ID_NAME,
      samplesets: SamplesetsFakeDb.SAMPLE_SETS
    };
  }
}
