import { UploadCnvToolResult } from 'src/app/shared/models/upload-cnv-tool-result.model';
export const MERGED_RESULT_NAME = 'merged result';
export const FINAL_RESULT_NAME = 'final result';
export const SELECTED_CNV_ID = 'selected CNV';

export class IndividualSampleConfig {
  referenceGenome?: string;
  chromosome?: string;
  cnvType?: string;
  uploadCnvToolResults?: UploadCnvToolResult[];
  samplesetName?: string;
  sample?: string;

  constructor(
    refenceGenome?,
    chromosome?,
    cnvType?,
    uploadCnvToolResults?,
    samplesetName?,
    sample?
  ) {
    this.referenceGenome = refenceGenome || '';
    this.chromosome = chromosome || '';
    this.cnvType = cnvType || '';
    this.uploadCnvToolResults = uploadCnvToolResults || [];
    this.samplesetName = samplesetName || '';
    this.sample = sample || '';
  }
}

export class MultipleSampleConfig {
  referenceGenome?: string;
  chromosome?: string;
  cnvType?: string;
  uploadCnvToolResult?: UploadCnvToolResult;
  samplesetName?: string;
  samples?: string[];

  constructor(
    refenceGenome?,
    chromosome?,
    cnvType?,
    uploadCnvToolResult?,
    samplesetName?,
    samples?
  ) {
    this.referenceGenome = refenceGenome || '';
    this.chromosome = chromosome || '';
    this.cnvType = cnvType || '';
    this.uploadCnvToolResult = uploadCnvToolResult || {};
    this.samplesetName = samplesetName || '';
    this.samples = samples || [];
  }
}
export class CnvGroup {
  cnvGroupName?: string; // cnv tool name and parameter.
  cnvInfos?: CnvInfo[]; // annotation for a given cnv tool.
}

export class CnvInfo {
  referenceGenome?: string;
  chromosome?: string;
  cnvType?: string;
  startBp?: number;
  endBp?: number;
  overlaps?: string[];
  dgvs?: DgvAnnotation[]; // dgv.variant_accession
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
  basepair?: RegionBp;

  constructor(geneId?, geneSymbol?, basepair?) {
    this.geneId = geneId || '';
    this.geneSymbol = geneSymbol || '';
    this.basepair = basepair || {};
  }
}

export class DgvAnnotation {
  variantAccession?: number;
  basepair?: RegionBp;

  constructor(variantAccession?, basepair?) {
    this.variantAccession = variantAccession || undefined;
    this.basepair = basepair || {};
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
