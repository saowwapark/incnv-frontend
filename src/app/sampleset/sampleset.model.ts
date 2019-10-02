export class Sampleset {
  samplesetId: number;
  userId: number;
  name: string; // hinted name for reminding all samples -> user can type whatever
  description: string;
  samples: string[]; // All samples for normalizing in cnv tools -> be unique and tend to have at least 30 samaples
  createDate: Date;
  modifyDate: Date;

  constructor() {
    this.samplesetId = null;
    this.userId = null;
    this.name = '';
    this.description = '';
    this.samples = [];
    this.createDate = null;
    this.modifyDate = null;
  }
}
