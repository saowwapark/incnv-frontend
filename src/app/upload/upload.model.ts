export class Upload {
  id: number;
  userId: number; // userName
  fileName: string;
  cnvToolName: string;
  samplesetId: number;
  samplesetName: string;
  tags: string[]; // can be null
  date: Date;
  size: string;
  filePath: string;
  constructor(upload) {
    {
      this.id = upload.id;
      this.userId = upload.userId;
      this.fileName = upload.fileName || '';
      this.cnvToolName = upload.cnvToolName || '';
      this.samplesetId = upload.samplesetId;
      this.samplesetName = upload.samplesetName || '';
      this.tags = upload.tags;
      this.date = upload.date;
      this.size = upload.size;
      this.filePath = upload.filePath;
    }
  }
}

export class UploadPost {
  userId: number; // userName
  fileType: string;
  assembly: string;
  fileName: string;
  extraFileInfo: string;
  cnvToolName: string;
  tabFileMappingId: number;
  samplesetId: number;
  tags: string[]; // can be null
  constructor(upload) {
    {
      this.userId = upload.userId;
      this.fileType = upload.fileType || '';
      this.assembly = upload.assembly || '';
      this.fileName = upload.fileName || '';
      this.extraFileInfo = upload.extraFileInfo || '';
      this.cnvToolName = upload.cnvToolName || '';
      this.tabFileMappingId = upload.tabFileMappingId;
      this.samplesetId = upload.samplesetId;
      this.tags = upload.tags;
    }
  }
}
