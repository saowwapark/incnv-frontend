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
        icon: 'build',
        children: [
          {
            id: 'tabFileMapping',
            title: 'File Mapping',
            type: 'item',
            icon: 'list',
            url: '/tabfilemapping'
          }
        ]
      },
      {
        id: 'sampleset',
        title: 'Sample Set',
        type: 'item',
        icon: 'face',
        url: '/sampleset'
      },
      {
        id: 'upload',
        title: 'Upload',
        type: 'collapsable',
        icon: 'folder',
        children: [
          {
            id: 'uploadCnvResult',
            title: 'Upload CNV Result',
            type: 'item',
            icon: 'cloud_upload',
            url: '/upload-cnv-result'
          },
          {
            id: 'myFiles',
            title: 'My Files',
            type: 'item',
            icon: 'description',
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
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    type: 'group',
    icon: 'pages',
    children: [
      {
        id: 'version',
        title: 'Version',
        type: 'item',
        icon: 'miscellaneous_services',
        url: '/maintenance/version'
      }
    ]
  }
];
