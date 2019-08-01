import { SampleSet } from './../sampleset/sampleset.model';

export class SampleSetsFakeDb {
  public static SAMPLE_SETS: SampleSet[] = [
    {
      id: 1,
      ownerId: 1,
      name: 'NGS-data1-G',
      sampleNames: [
        'G2223.remdup.uniqMap.TS.bam',
        'G2227-PJ.remdup.uniqMap.TS.bam',
        'G2228-M.remdup.uniqMap.TS.bam',
        'G2309.remdup.uniqMap.TS.bam',
        'G2359-BK.remdup.uniqMap.TS.bam',
        'G2360-M.remdup.uniqMap.TS.bam',
        'G2516.remdup.uniqMap.TS.bam',
        'G2996-PD.remdup.uniqMap.TS.bam',
        'G2997-M.remdup.uniqMap.TS.bam',
        'G3100.remdup.uniqMap.TS.bam'
      ]
    },
    {
      id: 2,
      ownerId: 1,
      name: 'NGS-data2-NA',
      sampleNames: [
        'NA06994',
        'NA10847',
        'NA11840',
        'NA12249',
        'NA12716',
        'NA12750',
        'NA12751',
        'NA12760',
        'NA12761',
        'NA12763',
        'NA18966',
        'NA18967',
        'NA18968',
        'NA18969',
        'NA18970',
        'NA18971',
        'NA18972',
        'NA18973',
        'NA18974',
        'NA18975',
        'NA18976',
        'NA18981',
        'NA18987',
        'NA18990',
        'NA18991',
        'NA19098',
        'NA19119',
        'NA19131',
        'NA19137',
        'NA19138',
        'NA19141',
        'NA19143',
        'NA19144',
        'NA19152',
        'NA19153',
        'NA19159',
        'NA19160',
        'NA19171',
        'NA19200',
        'NA19201',
        'NA19204',
        'NA19206',
        'NA19207',
        'NA19209',
        'NA19210',
        'NA19223'
      ]
    }
  ];
}
