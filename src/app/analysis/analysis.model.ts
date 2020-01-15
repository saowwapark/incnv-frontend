export const MERGED_TOOL_ID = 'merged tools';
export const FINAL_RESULT_ID = 'final result';
export const SELECTED_CNV_ID = 'selected CNV';

export class CnvTool {
  cnvToolId?: string; // cnv tool name and parameter.
  cnvInfos?: CnvInfo[]; // annotation for a given cnv tool.
}

export class CnvInfo {
  referenceGenome?: string;
  chromosome?: string;
  cnvType?: string;
  startBp?: number;
  endBp?: number;
  overlapTools?: string[];
  dgvs?: string[]; // dgv.variant_accession
  ensembls?: EnsemblAnnotation[]; // ensembl.gene_id
  clinvar?: ClinvarAnnotationList;
}

export class ClinvarAnnotationList {
  omimIds?: string[];
  phenotypes?: string[];
  clinicalSignificances?: string[];
  constructor(omimIds?, phenotypes?, clinicalSignificances?) {
    this.omimIds = omimIds || [];
    this.phenotypes = phenotypes || [];
    this.clinicalSignificances = clinicalSignificances || [];
  }
}

export class EnsemblAnnotation {
  geneId?: string;
  geneSymbol?: string;

  constructor(geneId?, geneSymbol?) {
    this.geneId = geneId || '';
    this.geneSymbol = geneSymbol || '';
  }
}

export class RegionBp {
  startBp: number;
  endBp: number;

  constructor(startBp, endBp) {
    this.startBp = startBp;
    this.endBp = endBp;
  }
}
