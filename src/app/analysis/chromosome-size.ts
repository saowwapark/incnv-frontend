export class ChoromosomeSize {
  name: string;
  sizeBp: number;
  constructor(name: string, size: number) {
    this.name = name;
    this.sizeBp = size;
  }
}

/**
 * Reference Data Source: https://en.wikipedia.org/wiki/Human_genome
 * Ensembl database at the European Bioinformatics Institute (EBI) and Wellcome Trust Sanger Institute
 */
export const CHROMOSOME_SIZE: any = {};

CHROMOSOME_SIZE.chr1 = new ChoromosomeSize('1', 248956422);
CHROMOSOME_SIZE.chr2 = new ChoromosomeSize('2', 242193529);
CHROMOSOME_SIZE.chr3 = new ChoromosomeSize('3', 198295559);
CHROMOSOME_SIZE.chr4 = new ChoromosomeSize('4', 190214555);
CHROMOSOME_SIZE.chr5 = new ChoromosomeSize('5', 181538259);
CHROMOSOME_SIZE.chr6 = new ChoromosomeSize('6', 170805979);
CHROMOSOME_SIZE.chr7 = new ChoromosomeSize('7', 159345973);
CHROMOSOME_SIZE.chr8 = new ChoromosomeSize('8', 145138636);
CHROMOSOME_SIZE.chr9 = new ChoromosomeSize('9', 138394717);
CHROMOSOME_SIZE.chr10 = new ChoromosomeSize('10', 133797422);
CHROMOSOME_SIZE.chr11 = new ChoromosomeSize('11', 135086622);
CHROMOSOME_SIZE.chr12 = new ChoromosomeSize('12', 133275309);
CHROMOSOME_SIZE.chr13 = new ChoromosomeSize('13', 114364328);
CHROMOSOME_SIZE.chr14 = new ChoromosomeSize('14', 107043718);
CHROMOSOME_SIZE.chr15 = new ChoromosomeSize('15', 101991189);
CHROMOSOME_SIZE.chr16 = new ChoromosomeSize('16', 90338345);
CHROMOSOME_SIZE.chr17 = new ChoromosomeSize('17', 83257441);
CHROMOSOME_SIZE.chr18 = new ChoromosomeSize('18', 80373285);
CHROMOSOME_SIZE.chr19 = new ChoromosomeSize('19', 58617616);
CHROMOSOME_SIZE.chr20 = new ChoromosomeSize('20', 64444167);
CHROMOSOME_SIZE.chr21 = new ChoromosomeSize('21', 46709983);
CHROMOSOME_SIZE.chr22 = new ChoromosomeSize('22', 50818468);
CHROMOSOME_SIZE.chrX = new ChoromosomeSize('x', 156040895);
CHROMOSOME_SIZE.chrY = new ChoromosomeSize('y', 57227415);
