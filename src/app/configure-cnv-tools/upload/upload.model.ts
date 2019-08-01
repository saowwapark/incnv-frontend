export class Upload {
  id: number;
  ownerId: number; // userName
  fileName: string;
  cnvToolName: string;
  sampleSetId: number;
  sampleSetName: string;
  tags: string[]; // can be null
  date: Date;
  size: string;
  filePath: string;
  constructor(upload) {
    {
      this.id = upload.id;
      this.ownerId = upload.ownerId;
      this.fileName = upload.fileName || '';
      this.cnvToolName = upload.cnvToolName || '';
      this.sampleSetId = upload.sampleSetId;
      this.sampleSetName = upload.sampleSetName || '';
      this.tags = upload.tags;
      this.date = upload.date;
      this.size = upload.size;
      this.filePath = upload.filePath;
    }
  }
}
