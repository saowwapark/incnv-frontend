export class SampleSet {
  id: number;
  ownerId: number;
  name: string; // hinted name for reminding all samples -> user can type whatever
  sampleNames: string[]; // All samples for normalizing in cnv tools -> be unique and tend to have at least 30 samaples
}
