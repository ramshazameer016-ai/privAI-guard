import { useState } from 'react';
import { Info } from 'lucide-react';

import { PolicyTable } from '../components/Policies/PolicyTable';
import { PolicyModal } from '../components/Policies/PolicyModal';

import type {
  Policy,
  SensitivityLevel,
  PolicyAction,
} from '../types/privacy';

const INITIAL_POLICIES: Policy[] = [
  {
    id: 'pol-1',
    termCategory: 'API_KEY',
    sensitivity: 'Critical',
    action: 'BLOCK',
    enabled: true,
    description: 'Detect and block API keys and credentials before they reach external AI providers.',
  },
  {
    id: 'pol-2',
    termCategory: 'CREDIT_CARD',
    sensitivity: 'Critical',
    action: 'BLOCK',
    enabled: true,
    description: 'Protect payment card information from being sent to external AI providers.',
  },
  {
    id: 'pol-3',
    termCategory: 'SSN',
    sensitivity: 'Critical',
    action: 'BLOCK',
    enabled: true,
    description: 'Protect Social Security numbers and other highly sensitive identifiers.',
  },
  {
    id: 'pol-4',
    termCategory: 'PROJECT',
    sensitivity: 'High',
    action: 'REDACT',
    enabled: true,
    description: 'Redact confidential internal project names before external AI processing.',
  },
  {
    id: 'pol-5',
    termCategory: 'CLIENT',
    sensitivity: 'High',
    action: 'REDACT',
    enabled: true,
    description: 'Redact confidential client names and customer references.',
  },
  {
    id: 'pol-6',
    termCategory: 'EMAIL',
    sensitivity: 'Medium',
    action: 'WARN',
    enabled: true,
    description: 'Warn when email addresses are detected in a prompt.',
  },
  {
    id: 'pol-7',
    termCategory: 'PHONE',
    sensitivity: 'Medium',
    action: 'WARN',
    enabled: true,
    description: 'Warn when phone numbers are detected in a prompt.',
  },
];

const PoliciesPage: React.FC = () => {
  const [policies, setPolicies] = useState<Policy[]>(INITIAL_POLICIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);

  const handleToggleStatus = (id: string) => {
    setPolicies((currentPolicies) =>
      currentPolicies.map((policy) =>
        policy.id === id
          ? {
              ...policy,
              enabled: !policy.enabled,
            }
          : policy
      )
    );
  };

  const handleChangeAction = (
    id: string,
    action: PolicyAction
  ) => {
    setPolicies((currentPolicies) =>
      currentPolicies.map((policy) =>
        policy.id === id
          ? {
              ...policy,
              action,
            }
          : policy
      )
    );
  };

  const handleChangeSensitivity = (
    id: string,
    sensitivity: SensitivityLevel
  ) => {
    setPolicies((currentPolicies) =>
      currentPolicies.map((policy) =>
        policy.id === id
          ? {
              ...policy,
              sensitivity,
            }
          : policy
      )
    );
  };

  const handleEditPolicy = (policy: Policy) => {
    setEditingPolicy(policy);
    setIsModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setEditingPolicy(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPolicy(null);
  };

  const handleSavePolicy = (policy: Policy) => {
    setPolicies((currentPolicies) => {
      const existingPolicy = currentPolicies.some(
        (existing) => existing.id === policy.id
      );

      if (existingPolicy) {
        return currentPolicies.map((existing) =>
          existing.id === policy.id ? policy : existing
        );
      }

      return [...currentPolicies, policy];
    });

    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          Company Policies
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Configure sensitive term triggers, severity classifications,
          and enforcement actions for the privacy gateway.
        </p>
      </div>

      <div className="rounded-xl border border-blue-900/60 bg-blue-950/30 p-4">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400" />

          <div>
            <h2 className="text-sm font-semibold text-blue-300">
              Policy Engine: Client State
            </h2>

            <p className="mt-1 text-xs leading-5 text-blue-200/80">
              Policy modifications are currently managed in browser
              state. Backend policy synchronization is not yet enabled.
            </p>
          </div>
        </div>
      </div>

      <PolicyTable
        policies={policies}
        onToggleStatus={handleToggleStatus}
        onChangeAction={handleChangeAction}
        onChangeSensitivity={handleChangeSensitivity}
        onEditPolicy={handleEditPolicy}
        onOpenAddModal={handleOpenAddModal}
      />

      <PolicyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePolicy}
        initialPolicy={editingPolicy}
      />
    </div>
  );
};

export default PoliciesPage;