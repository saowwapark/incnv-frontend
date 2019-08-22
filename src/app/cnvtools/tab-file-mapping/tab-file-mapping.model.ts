/*************************** Front End *****************************/

export class HeaderField {
  sampleName: string;
  chr: string;
  startBp: string;
  endBp: string;
  cnvType: string;
}
export class DataField {
  chr22: string;
  dup: string;
  del: string;
}
export class TabFileMappingConfigured {
  id: number;
  userId: number;
  cnvToolName: string;
  headerField: HeaderField;
  dataField: DataField;

  constructor(tabFileMappingConfigured?) {
    if (tabFileMappingConfigured) {
      this.id = tabFileMappingConfigured.id;
      this.userId = tabFileMappingConfigured.owerId;
      this.cnvToolName = tabFileMappingConfigured.cnvToolName;
      this.headerField = tabFileMappingConfigured.headerField;
      this.dataField = tabFileMappingConfigured.dataField;
    } else {
      this.headerField = new HeaderField();
      this.dataField = new DataField();
    }
  }
}
export const CODEX2: TabFileMappingConfigured = {
  id: 1,
  userId: 1, // 0 = admin, 1 = userlevel1
  cnvToolName: 'CODEX2',
  headerField: {
    sampleName: 'sample_name',
    chr: 'chr',
    startBp: 'st_bp',
    endBp: 'ed_bp',
    cnvType: 'cnv'
  },
  dataField: {
    chr22: 'chr22',
    dup: 'dup',
    del: 'del'
  }
};

export const CoNIFER: TabFileMappingConfigured = {
  id: 2,
  userId: 1, // 0 = admin, 1 = userlevel1
  cnvToolName: 'CoNIFER',
  headerField: {
    sampleName: 'sampleID',
    chr: 'chromosome',
    startBp: 'start',
    endBp: 'stop',
    cnvType: 'state'
  },
  dataField: {
    chr22: 'chr22',
    dup: 'dup',
    del: 'del'
  }
};

export const CONTRA: TabFileMappingConfigured = {
  id: 3,
  userId: 1, // 0 = admin, 1 = userlevel1
  cnvToolName: 'CONTRA',
  headerField: {
    sampleName: 'Target.Region.ID',
    chr: 'chr',
    startBp: 'OriStrCoordinate',
    endBp: 'OriEndCoordinate',
    cnvType: 'gain.loss'
  },
  dataField: {
    chr22: 'chr22',
    dup: 'gain',
    del: 'loss'
  }
};

/**
 * old version, don't use anymore
 */

// don't use
export class HeaderFieldOld {
  id: number;
  userId: number;
  cnvToolName: string;
  sampleName: string;
  chr: string;
  startBp: string;
  endBp: string;
  cnvType: string;
}
// don't use
export const HEADER_CODEX2: HeaderFieldOld = {
  id: 1,
  userId: 1, // 0 = admin, 1 = userlevel1
  cnvToolName: 'CODEX2',
  sampleName: 'sample_name',
  chr: 'chr',
  startBp: 'st_bp',
  endBp: 'ed_bp',
  cnvType: 'cnv'
};
// don't use
export const HEADER_CoNIFER: HeaderFieldOld = {
  id: 2,
  userId: 1, // 0 = admin, 1 = userlevel1
  cnvToolName: 'CoNIFER',
  sampleName: 'sampleID',
  chr: 'chromosome',
  startBp: 'start',
  endBp: 'stop',
  cnvType: 'state'
};

/*************************** Back End *****************************/
/**
 * key-value: fieldName-column
 * tell that each field is on what column number
 */
export interface FieldColumn {
  fieldName: string;
  columnId: number; // start at 0
}

/**
 * ChosenHeader is object type after each user config header fields
 * primary key = userId + cnvToolName
 */
export interface ChosenHeader {
  id: number;
  userId: number;
  cnvToolName: string;
  sampleName: FieldColumn;
  chr: FieldColumn;
  startBp: FieldColumn;
  endBp: FieldColumn;
  cnvType: FieldColumn;
}

export interface CNVtoolMapHeader {
  cnvToolName: string;
  headers: FieldColumn[];
}

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
  userId: 1, // 0 = admin, 1 = userlevel1
  cnvToolName: 'CODEX2',
  sampleName: { fieldName: 'sample_name', columnId: 0 },
  chr: { fieldName: 'chr', columnId: 1 },
  startBp: { fieldName: 'st_bp', columnId: 3 },
  endBp: { fieldName: 'ed_bp', columnId: 4 },
  cnvType: { fieldName: 'cnv', columnId: 2 }
};

export const CHOSEN_HEADER_CoNIFER: ChosenHeader = {
  id: 2,
  userId: 1, // 0 = admin, 1 = userlevel1
  cnvToolName: 'CoNIFER',
  sampleName: { fieldName: 'sampleID', columnId: 0 },
  chr: { fieldName: 'chromosome', columnId: 1 },
  startBp: { fieldName: 'start', columnId: 2 },
  endBp: { fieldName: 'stop', columnId: 3 },
  cnvType: { fieldName: 'state', columnId: 4 }
};
