import type { Policy } from '../types/privacy';

export const INITIAL_MOCK_POLICIES: Policy[] = [
  {
    id: 'pol-1',
    termCategory: 'API Keys',
    sensitivity: 'Critical',
    action: 'BLOCK',
    enabled: true,
    description: 'High-entropy secret keys, token patterns, and cloud provider credentials.',
  },
  {
    id: 'pol-2',
    termCategory: 'Customer Email',
    sensitivity: 'High',
    action: 'REDACT',
    enabled: true,
    description: 'Direct email addresses identifying external clients or consumers.',
  },
  {
    id: 'pol-3',
    termCategory: 'Project Phoenix',
    sensitivity: 'High',
    action: 'REDACT',
    enabled: true,
    description: 'Proprietary confidential codename for Q4 strategic cloud migration.',
  },
  {
    id: 'pol-4',
    termCategory: 'Internal Project Names',
    sensitivity: 'High',
    action: 'REDACT',
    enabled: true,
    description: 'Registered organization internal initiatives and classified codenames.',
  },
  {
    id: 'pol-5',
    termCategory: 'Phone Number',
    sensitivity: 'Medium',
    action: 'REDACT',
    enabled: true,
    description: 'E.164 and localized telephone numbers for employees and clients.',
  },
  {
    id: 'pol-6',
    termCategory: 'Credit Card',
    sensitivity: 'Critical',
    action: 'BLOCK',
    enabled: true,
    description: 'Payment card numbers matching Luhn checksum standards.',
  },
];
