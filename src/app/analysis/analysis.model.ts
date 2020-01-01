export class CnvToolAnnotation {
  cnvToolIdentity?: string; // cnv tool name and parameter.
  cnvToolAnnotations?: CnvFragmentAnnotation[]; // annotation for a given cnv tool.
}

export class CnvFragmentAnnotation {
  chromosome?: string;
  cnvType?: string;
  startBp?: number;
  endBp?: number;
  overlapTools?: string[];
  startBpOnRegion?: number;
  endBpOnRegion?: number;
  dgv?: string[]; // dgv.variant_accession
  ensembl?: string[]; // ensembl.gene_id
  clinvar;
}
