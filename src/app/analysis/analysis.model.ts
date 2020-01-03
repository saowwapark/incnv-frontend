export class CnvToolAnnotation {
  cnvToolIdentity?: string; // cnv tool name and parameter.
  cnvToolAnnotations?: CnvFragmentAnnotation[]; // annotation for a given cnv tool.
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
