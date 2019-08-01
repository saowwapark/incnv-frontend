import { FieldColumn, ChosenHeader, HeaderField } from '../header-field';

export const ALL_HEADER_CODEX2: FieldColumn[] = [
  { fieldName: 'sample_name', columnId: 0 },
  { fieldName: 'chr', columnId: 1 },
  { fieldName: 'cnv', columnId: 2 },
  { fieldName: 'st_bp', columnId: 3 },
  { fieldName: 'ed_bp', columnId: 4 },
  { fieldName: 'lenght_kb', columnId: 5 },
  { fieldName: 'st_exon', columnId: 6 },
  { fieldName: 'ed_exon', columnId: 7 },
  { fieldName: 'raw_cov', columnId: 8 },
  { fieldName: 'norm_cov', columnId: 9 },
  { fieldName: 'copy_no', columnId: 10 },
  { fieldName: 'lratio', columnId: 11 },
  { fieldName: 'mBIC', columnId: 12 }
];
export const ALL_HEADER_CoNIFER: FieldColumn[] = [
  { fieldName: 'sampleID', columnId: 0 },
  { fieldName: 'chromosome', columnId: 1 },
  { fieldName: 'start', columnId: 2 },
  { fieldName: 'stop', columnId: 3 },
  { fieldName: 'state', columnId: 4 }
];

export const CHOSEN_HEADER_CODEX2: ChosenHeader = {
  id: 1,
  ownerId: 1, // 0 = admin, 1 = userlevel1
  cnvToolName: 'CODEX2',
  sampleName: { fieldName: 'sample_name', columnId: 0 },
  chr: { fieldName: 'chr', columnId: 1 },
  startBp: { fieldName: 'st_bp', columnId: 3 },
  stopBp: { fieldName: 'ed_bp', columnId: 4 },
  cnvType: { fieldName: 'cnv', columnId: 2 }
};

export const CHOSEN_HEADER_CoNIFER: ChosenHeader = {
  id: 2,
  ownerId: 1, // 0 = admin, 1 = userlevel1
  cnvToolName: 'CoNIFER',
  sampleName: { fieldName: 'sampleID', columnId: 0 },
  chr: { fieldName: 'chromosome', columnId: 1 },
  startBp: { fieldName: 'start', columnId: 2 },
  stopBp: { fieldName: 'stop', columnId: 3 },
  cnvType: { fieldName: 'state', columnId: 4 }
};

export const HEADER_CODEX2: HeaderField = {
  id: 1,
  ownerId: 1, // 0 = admin, 1 = userlevel1
  cnvToolName: 'CODEX2',
  sampleName: 'sample_name',
  chr: 'chr',
  startBp: 'st_bp',
  stopBp: 'ed_bp',
  cnvType: 'cnv'
};

export const HEADER_CoNIFER: HeaderField = {
  id: 2,
  ownerId: 1, // 0 = admin, 1 = userlevel1
  cnvToolName: 'CoNIFER',
  sampleName: 'sampleID',
  chr: 'chromosome',
  startBp: 'start',
  stopBp: 'stop',
  cnvType: 'state'
};
