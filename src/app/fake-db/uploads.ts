import { Upload } from '../upload/upload.model';
/**
 * primary key 1 = id
 * primary key 2 = userId+ fileName + cnvToolName + sampleset1
 * See uploaded file history:
 *  - SELECT * FROM UploadFileInfo WHERE owner = '...';
 * Choose uploaded files to analyze:
 *  - select records with filetering owner + sampleset
 */

/**
 * define real table in db
 * we use a samplesetName property only in frontend.
 */
export interface UploadFileInfo {
  id: number;
  userId: number; // userName
  fileName: string;
  cnvToolName: string;
  samplesetId: number;
  tags: string[]; // can be null
  date: Date;
  size: string;
  filePath: string;
}

export class UploadsFakeDb {
  public static UPLOAD_FILES: Upload[] = [
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
    },
    {
      id: 3,
      userId: 1,
      fileName: 'ccccccccccccc.txt',
      cnvToolName: 'CODEX2',
      samplesetId: 2,
      samplesetName: 'NGS-data2-NA',
      tags: [],
      date: new Date('December 17, 1995 03:24:00'),
      size: '128 B',
      filePath: 'C:/local/username/filename'
    }
  ];
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
  public static UPLOAD_FILES_SAMPLESET_2: Upload[] = [
    {
      id: 3,
      userId: 1,
      fileName: 'ccccccccccccc.txt',
      cnvToolName: 'CODEX2',
      samplesetId: 2,
      samplesetName: 'NGS-data2-NA',
      tags: [],
      date: new Date('December 17, 1995 03:24:00'),
      size: '128 B',
      filePath: 'C:/local/username/filename'
    }
  ];
}
