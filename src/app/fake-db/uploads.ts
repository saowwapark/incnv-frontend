import { Upload } from './../configure-cnv-tools/upload/upload.model';
/**
 * primary key 1 = id
 * primary key 2 = ownerId+ fileName + cnvToolName + sampleSet1
 * See uploaded file history:
 *  - SELECT * FROM UploadFileInfo WHERE owner = '...';
 * Choose uploaded files to analyze:
 *  - select records with filetering owner + sampleSet
 */

// define real table in db
export interface UploadFileInfo {
  id: number;
  ownerId: number; // userName
  fileName: string;
  cnvToolName: string;
  sampleSetId: number;
  tags: string[]; // can be null
  date: Date;
  size: string;
  filePath: string;
}

export class UploadsFakeDb {
  public static UPLOAD_FILES: Upload[] = [
    {
      id: 1,
      ownerId: 1,
      fileName: 'aaaaaaaaaaa.txt',
      cnvToolName: 'CODEX2',
      sampleSetId: 1,
      sampleSetName: 'NGS-data1-G',
      tags: ['chr1', 'diabetes'],
      date: new Date('December 17, 1995 03:24:00'),
      size: '18.24 KB',
      filePath: 'C:/local/username/filename' // show icon link -> click open new tab or download file
    },
    {
      id: 2,
      ownerId: 1,
      fileName: 'bbbbbbbbbbb.txt',
      cnvToolName: 'CoNIFER',
      sampleSetId: 1,
      sampleSetName: 'NGS-data1-G',
      tags: [],
      date: new Date('December 17, 1995 03:24:00'),
      size: '20 kB',
      filePath: 'C:/local/username/filename'
    },
    {
      id: 3,
      ownerId: 1,
      fileName: 'ccccccccccccc.txt',
      cnvToolName: 'CODEX2',
      sampleSetId: 2,
      sampleSetName: 'NGS-data2-NA',
      tags: [],
      date: new Date('December 17, 1995 03:24:00'),
      size: '128 B',
      filePath: 'C:/local/username/filename'
    }
  ];
}
