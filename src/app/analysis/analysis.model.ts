export const MERGE_TOOL_IDENTITY = 'merged tools';
export const FINAL_RESULT_IDENTITY = 'final result';

export class CnvToolAnnotation {
  cnvToolIdentity?: string; // cnv tool name and parameter.
  cnvFragmentAnnotations?: CnvFragmentAnnotation[]; // annotation for a given cnv tool.
}

export class CnvFragmentAnnotation {
  referenceGenome?: string;
  chromosome?: string;
  cnvType?: string;
  startBp?: number;
  endBp?: number;
  overlapTools?: string[];
  startBpOnRegion?: number;
  endBpOnRegion?: number;
  dgvs?: string[]; // dgv.variant_accession
  ensembls?: string[]; // ensembl.gene_id
  clinvars;
}

export class RegionBp {
  startBp: number;
  endBp: number;

  constructor(startBp, endBp) {
    this.startBp = startBp;
    this.endBp = endBp;
  }
}
