import { Upload } from '../upload/upload.model';
export class UploadsFakeDb {
  public static UPLOAD_FILES_SAMPLESET_1: Upload[] = [
    {
      id: 1,
      userId: 1,
      fileName: 'aaaaaaaaaaa.txt',
      cnvToolName: 'CODEX2',
      samplesetId: 1,
      samplesetName: 'NGS-data1-G',
      tags: ['chr1', 'diabetes'],
      date: new Date('December 17, 1995 03:24:00'),
      size: '18.24 KB',
      filePath: 'C:/local/username/filename' // show icon link -> click open new tab or download file
    },
    {
      id: 2,
      userId: 1,
      fileName: 'bbbbbbbbbbb.txt',
      cnvToolName: 'CoNIFER',
      samplesetId: 1,
      samplesetName: 'NGS-data1-G',
      tags: [],
      date: new Date('December 17, 1995 03:24:00'),
      size: '20 kB',
      filePath: 'C:/local/username/filename'
    }
  ];
}
