import { Navigation } from './navigation.model';

export const navigationData: Navigation[] = [
  {
    id: 'preparation',
    title: 'Preparation',
    type: 'group',
    icon: 'apps',
    children: [
      {
        id: 'upload',
        title: 'Upload',
        type: 'collapsable',
        icon: 'dashboard',
        children: [
          {
            id: 'configurefiles',
            title: 'Configure Files',
            type: 'item',
            url: '/configurefile'
          },
          {
            id: 'history',
            title: 'History',
            type: 'item',
            url: '/uploadhistory'
          }
        ]
      },
      {
        id: 'sampleset',
        title: 'Sampleset',
        type: 'item',
        icon: 'shopping_cart',
        url: '/sampleset'
      },
      {
        id: 'cnvtool',
        title: 'CNVtool',
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
        url: '/analysis'
      },
      {
        id: 'mulitpleSamples',
        title: 'Multiple Samples',
        type: 'item',
        icon: 'school',
        url: '/analysis'
      }
    ]
  }
];
