import { Navigation } from './navigation.model';

export const navigationData: Navigation[] = [
  {
    id: 'files',
    title: 'Files',
    type: 'group',
    icon: 'folder',
    children: [
      {
        id: 'uploadCnvs',
        title: 'Upload CNVs',
        type: 'item',
        icon: 'upload_file',
        url: '/upload-cnvs'
      },
      {
        id: 'myFiles',
        title: 'My Files',
        type: 'item',
        icon: 'folder',
        url: '/myfiles'
      }
    ]
  },
  {
    id: 'mapping',
    title: 'Mapping',
    type: 'group',
    icon: 'build',
    children: [
      {
        id: 'tabFileMapping',
        title: 'File Mapping',
        type: 'item',
        icon: 'article',
        url: '/tabfilemapping'
      },
      {
        id: 'sampleset',
        title: 'Sample Set',
        type: 'item',
        icon: 'person',
        url: '/sampleset'
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
        icon: 'analytics',
        url: '/analysis/individual-sample'
      },
      {
        id: 'mulitpleSamples',
        title: 'Multiple Samples',
        type: 'item',
        icon: 'analytics',
        url: '/analysis/multiple-sample'
      }
    ]
  }
];
