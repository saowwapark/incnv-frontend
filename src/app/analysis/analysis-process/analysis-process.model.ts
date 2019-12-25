export class CnvToolDetail {
  cnvToolName?: string; // cnv tool name.
  cnvAnnotations?: CnvAnnotation[]; // annotation for a given cnv tool.
}
export class CnvAnnotation {
  chromosome?: string;
  cnvType?: string;
  startBasepair?: number;
  endBasepair?: number;
  dgv?: string[]; // dgv.variant_accession
  ensembl?: string[]; // ensembl.gene_id
  clinvar;
}
