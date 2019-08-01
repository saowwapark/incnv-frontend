import { Navigation } from '../types/navigation';

export const navigationData: Navigation[] = [
  {
    id: 'applications',
    title: 'Applications',
    type: 'group',
    icon: 'apps',
    children: [
      {
        id: 'configureFiles',
        title: 'Configure Files',
        type: 'collapsable',
        icon: 'dashboard',
        children: [
          {
            id: 'configureheaderfields',
            title: 'Header Fields',
            type: 'item',
            url: '/configureheaderfields'
          },
          {
            id: 'upload',
            title: 'Upload',
            type: 'item',
            url: '/upload'
          }
        ]
      },
      {
        id: 'activities',
        title: 'Activities',
        type: 'item',
        icon: 'today',
        url: '/activities'
      },
      {
        id: 'sampleset',
        title: 'Sampleset',
        type: 'item',
        icon: 'shopping_cart',
        url: '/sampleset'
      },
      {
        id: 'analysis',
        title: 'Analysis',
        type: 'item',
        icon: 'school',
        url: '/analysis'
      },
      {
        id: 'snapshot',
        title: 'Snapshot',
        type: 'item',
        icon: 'email',
        url: '/apps/mail'
      },
      {
        id: 'exportResult',
        title: 'Export Result',
        type: 'item',
        icon: 'email',
        url: '/apps/mail-ngrx'
      }
    ]
  },
  {
    id: 'pages',
    title: 'Pages',
    type: 'group',
    icon: 'pages',
    children: [
      {
        id: 'authentication',
        title: 'Authentication',
        type: 'collapsable',
        icon: 'lock',
        children: [
          {
            id: 'login',
            title: 'Login',
            type: 'item',
            url: '/pages/auth/login'
          },
          {
            id: 'login-v2',
            title: 'Login v2',
            type: 'item',
            url: '/pages/auth/login-2'
          },
          {
            id: 'register',
            title: 'Register',
            type: 'item',
            url: '/pages/auth/register'
          },
          {
            id: 'register-v2',
            title: 'Register v2',
            type: 'item',
            url: '/pages/auth/register-2'
          },
          {
            id: 'forgot-password',
            title: 'Forgot Password',
            type: 'item',
            url: '/pages/auth/forgot-password'
          },
          {
            id: 'forgot-password-v2',
            title: 'Forgot Password v2',
            type: 'item',
            url: '/pages/auth/forgot-password-2'
          },
          {
            id: 'reset-password',
            title: 'Reset Password',
            type: 'item',
            url: '/pages/auth/reset-password'
          },
          {
            id: 'reset-password-v2',
            title: 'Reset Password v2',
            type: 'item',
            url: '/pages/auth/reset-password-2'
          },
          {
            id: 'lock-screen',
            title: 'Lock Screen',
            type: 'item',
            url: '/pages/auth/lock'
          },
          {
            id: 'mail-confirmation',
            title: 'Mail Confirmation',
            type: 'item',
            url: '/pages/auth/mail-confirm'
          }
        ]
      },
      {
        id: 'coming-soon',
        title: 'Coming Soon',
        type: 'item',
        icon: 'alarm',
        url: '/pages/coming-soon'
      },
      {
        id: 'errors',
        title: 'Errors',
        type: 'collapsable',
        icon: 'error',
        children: [
          {
            id: '404',
            title: '404',
            type: 'item',
            url: '/pages/errors/error-404'
          },
          {
            id: '500',
            title: '500',
            type: 'item',
            url: '/pages/errors/error-500'
          }
        ]
      },
      {
        id: 'invoice',
        title: 'Invoice',
        type: 'collapsable',
        icon: 'receipt',
        children: [
          {
            id: 'modern',
            title: 'Modern',
            type: 'item',
            url: '/pages/invoices/modern'
          },
          {
            id: 'compact',
            title: 'Compact',
            type: 'item',
            url: '/pages/invoices/compact'
          }
        ]
      },
      {
        id: 'maintenance',
        title: 'Maintenance',
        type: 'item',
        icon: 'build',
        url: '/pages/maintenance'
      },
      {
        id: 'pricing',
        title: 'Pricing',
        type: 'collapsable',
        icon: 'attach_money',
        children: [
          {
            id: 'style-1',
            title: 'Style 1',
            type: 'item',
            url: '/pages/pricing/style-1'
          },
          {
            id: 'style-2',
            title: 'Style 2',
            type: 'item',
            url: '/pages/pricing/style-2'
          },
          {
            id: 'style-3',
            title: 'Style 3',
            type: 'item',
            url: '/pages/pricing/style-3'
          }
        ]
      },
      {
        id: 'profile',
        title: 'Profile',
        type: 'item',
        icon: 'person',
        url: '/pages/profile'
      },
      {
        id: 'search',
        title: 'Search',
        type: 'collapsable',
        icon: 'search',
        children: [
          {
            id: 'search-classic',
            title: 'Classic',
            type: 'item',
            url: '/pages/search/classic'
          },
          {
            id: 'search-modern',
            title: 'Modern',
            type: 'item',
            url: '/pages/search/modern'
          }
        ]
      },
      {
        id: 'faq',
        title: 'Faq',
        type: 'item',
        icon: 'help',
        url: '/pages/faq'
      },
      {
        id: 'knowledge-base',
        title: 'Knowledge Base',
        type: 'item',
        icon: 'import_contacts',
        url: '/pages/knowledge-base'
      }
    ]
  }
];
