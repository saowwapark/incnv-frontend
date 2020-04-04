import { Navigation } from './navigation.model';

export const navigationData: Navigation[] = [
  {
    id: 'preparation',
    title: 'Preparation',
    type: 'group',
    icon: 'apps',
    children: [
      {
        id: 'cnvtool',
        title: 'CNV Tool',
        type: 'collapsable',
        icon: 'dashboard',
        children: [
          {
            id: 'tabFileMapping',
            title: 'File Mapping',
            type: 'item',
            url: '/tabfilemapping'
          }
        ]
      },
      {
        id: 'sampleset',
        title: 'Sample Set',
        type: 'item',
        icon: 'shopping_cart',
        url: '/sampleset'
      },
      {
        id: 'upload',
        title: 'Upload',
        type: 'collapsable',
        icon: 'dashboard',
        children: [
          {
            id: 'uploadCnvResult',
            title: 'Upload CNV Result',
            type: 'item',
            url: '/upload-cnv-result'
          },
          {
            id: 'myFiles',
            title: 'My Files',
            type: 'item',
            url: '/myfiles'
          }
        ]
      }
    ]
  },
  {
    id: 'analysis',
    title: 'Analysis',
    type: 'group',
    icon: 'pages',
    children: [
      {
        id: 'individualSample',
        title: 'Individual Sample',
        type: 'item',
        icon: 'school',
        url: '/analysis/individual-sample'
      },
      {
        id: 'mulitpleSamples',
        title: 'Multiple Samples',
        type: 'item',
        icon: 'school',
        url: '/analysis/multiple-sample'
      }
    ]
  }
];
