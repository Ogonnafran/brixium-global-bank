
import React, { useState } from 'react';
import AdminConfirmModal from './AdminConfirmModal';
import { useToast } from '../../contexts/ToastContext';
import { useAppState } from '../../contexts/AppStateContext';

interface AdminActionConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'approve_transaction' | 'reject_transaction' | 'approve_kyc' | 'reject_kyc' | 'lock_user' | 'unlock_user' | 'freeze_wallet' | 'unfreeze_wallet';
  targetId: string;
  targetName?: string;
  onSuccess?: () => void;
}

const AdminActionConfirm: React.FC<AdminActionConfirmProps> = ({
  isOpen,
  onClose,
  action,
  targetId,
  targetName = '',
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { updateTransaction, updateKYC, lockUser, unlockUser, freezeWallet, unfreezeWallet } = useAppState();

  const getActionDetails = () => {
    switch (action) {
      case 'approve_transaction':
        return {
          title: 'Approve Transaction',
          message: `Are you sure you want to approve transaction ${targetId}? This action cannot be undone.`,
          type: 'success' as const,
          confirmText: 'Approve'
        };
      case 'reject_transaction':
        return {
          title: 'Reject Transaction',
          message: `Are you sure you want to reject transaction ${targetId}? Funds will be returned to the user.`,
          type: 'danger' as const,
          confirmText: 'Reject'
        };
      case 'approve_kyc':
        return {
          title: 'Approve KYC',
          message: `Are you sure you want to approve KYC submission for ${targetName}?`,
          type: 'success' as const,
          confirmText: 'Approve'
        };
      case 'reject_kyc':
        return {
          title: 'Reject KYC',
          message: `Are you sure you want to reject KYC submission for ${targetName}? The user will need to resubmit documents.`,
          type: 'danger' as const,
          confirmText: 'Reject'
        };
      case 'lock_user':
        return {
          title: 'Lock User Account',
          message: `Are you sure you want to lock ${targetName}'s account? They will not be able to access their funds.`,
          type: 'danger' as const,
          confirmText: 'Lock Account'
        };
      case 'unlock_user':
        return {
          title: 'Unlock User Account',
          message: `Are you sure you want to unlock ${targetName}'s account?`,
          type: 'success' as const,
          confirmText: 'Unlock Account'
        };
      case 'freeze_wallet':
        return {
          title: 'Freeze Wallet',
          message: `Are you sure you want to freeze all wallets for ${targetName}? They will not be able to make transactions.`,
          type: 'danger' as const,
          confirmText: 'Freeze Wallets'
        };
      case 'unfreeze_wallet':
        return {
          title: 'Unfreeze Wallet',
          message: `Are you sure you want to unfreeze all wallets for ${targetName}?`,
          type: 'success' as const,
          confirmText: 'Unfreeze Wallets'
        };
      default:
        return {
          title: 'Confirm Action',
          message: 'Are you sure you want to perform this action?',
          type: 'warning' as const,
          confirmText: 'Confirm'
        };
    }
  };

  const handleConfirm = async () => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      switch (action) {
        case 'approve_transaction':
          updateTransaction(targetId, { status: 'completed' });
          addToast({
            type: 'success',
            title: 'Transaction Approved',
            message: `Transaction ${targetId} has been approved and processed.`
          });
          break;
        case 'reject_transaction':
          updateTransaction(targetId, { status: 'failed' });
          addToast({
            type: 'info',
            title: 'Transaction Rejected',
            message: `Transaction ${targetId} has been rejected. Funds returned to user.`
          });
          break;
        case 'approve_kyc':
          updateKYC(targetId, { status: 'approved' });
          addToast({
            type: 'success',
            title: 'KYC Approved',
            message: `KYC submission for ${targetName} has been approved.`
          });
          break;
        case 'reject_kyc':
          updateKYC(targetId, { status: 'rejected' });
          addToast({
            type: 'warning',
            title: 'KYC Rejected',
            message: `KYC submission for ${targetName} has been rejected.`
          });
          break;
        case 'lock_user':
          lockUser(targetId);
          addToast({
            type: 'warning',
            title: 'Account Locked',
            message: `${targetName}'s account has been locked.`
          });
          break;
        case 'unlock_user':
          unlockUser(targetId);
          addToast({
            type: 'success',
            title: 'Account Unlocked',
            message: `${targetName}'s account has been unlocked.`
          });
          break;
        case 'freeze_wallet':
          freezeWallet(targetId);
          addToast({
            type: 'warning',
            title: 'Wallets Frozen',
            message: `All wallets for ${targetName} have been frozen.`
          });
          break;
        case 'unfreeze_wallet':
          unfreezeWallet(targetId);
          addToast({
            type: 'success',
            title: 'Wallets Unfrozen',
            message: `All wallets for ${targetName} have been unfrozen.`
          });
          break;
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Action Failed',
        message: 'An error occurred while processing your request. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const actionDetails = getActionDetails();

  return (
    <AdminConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title={actionDetails.title}
      message={actionDetails.message}
      type={actionDetails.type}
      confirmText={actionDetails.confirmText}
      loading={loading}
    />
  );
};

export default AdminActionConfirm;
