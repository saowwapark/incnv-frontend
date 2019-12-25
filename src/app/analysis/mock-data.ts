// setting value for mocking data
export const chosenReferenceGenome = 'grch37';

export const chosenSampleset = {
  samplesetId: 202,
  userId: 1,
  samplesetName: 'sampleset1',
  description: 'diabetes',
  samples: [
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
  ],
  createDate: new Date('2019-11-26 13:01:29'),
  modifyDate: null
};

export const chosenSample = 'NA10847';

export const chosenFiles = [
  {
    uploadCnvToolResultId: 56,
    samplesetId: 202,
    samplesetName: '',
    tabFileMappingId: 1,
    tabFileMappingName: '',
    fileName: 'CODEX2_fullbam_2_frac.txt',
    fileInfo: 'test',
    cnvToolName: 'test',
    referenceGenome: 'grch37',
    tagDescriptions: ['test'],
    createDate: new Date('2019-12-18 23:35:15'),
    modifyDate: null
  },
  {
    uploadCnvToolResultId: 68,
    samplesetId: 202,
    samplesetName: '',
    tabFileMappingId: 5,
    tabFileMappingName: '',
    fileName: 'fullbam_noY_calls.txt',
    fileInfo: 'test',
    cnvToolName: 'conifer',
    referenceGenome: 'grch37',
    tagDescriptions: ['tag test'],
    createDate: new Date('2019-12-23 09:50:35'),
    modifyDate: null
  }
];

export const chosenCnvType = 'duplication';

export const chosenChr = '1';
