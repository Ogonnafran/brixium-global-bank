
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminActionConfirm from './AdminActionConfirm';
import { useAppState } from '../../contexts/AppStateContext';

const KYCManagement: React.FC = () => {
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [confirmAction, setConfirmAction] = useState<{
    isOpen: boolean;
    action: 'approve_kyc' | 'reject_kyc';
    targetId: string;
    targetName: string;
  }>({
    isOpen: false,
    action: 'approve_kyc',
    targetId: '',
    targetName: ''
  });

  const { state } = useAppState();

  // Use real KYC data from state, fallback to mock data for demo
  const kycSubmissions = state.kycSubmissions.length > 0 ? state.kycSubmissions : [
    {
      id: 'KYC001',
      user: 'John Doe',
      email: 'john.doe@email.com',
      submittedAt: '2024-06-03 10:30',
      status: 'pending' as const,
      documents: ['Passport', 'Utility Bill'],
      riskLevel: 'low' as const
    },
    {
      id: 'KYC002',
      user: 'Jane Smith',
      email: 'jane.smith@email.com',
      submittedAt: '2024-06-03 09:15',
      status: 'pending' as const,
      documents: ['Driver License', 'Bank Statement'],
      riskLevel: 'medium' as const
    },
    {
      id: 'KYC003',
      user: 'Mike Johnson',
      email: 'mike.j@email.com',
      submittedAt: '2024-06-03 08:45',
      status: 'pending' as const,
      documents: ['National ID', 'Proof of Address'],
      riskLevel: 'high' as const
    },
  ];

  const handleApprove = (id: string, userName: string) => {
    setConfirmAction({
      isOpen: true,
      action: 'approve_kyc',
      targetId: id,
      targetName: userName
    });
  };

  const handleReject = (id: string, userName: string) => {
    setConfirmAction({
      isOpen: true,
      action: 'reject_kyc',
      targetId: id,
      targetName: userName
    });
  };

  const closeConfirm = () => {
    setConfirmAction({
      isOpen: false,
      action: 'approve_kyc',
      targetId: '',
      targetName: ''
    });
  };

  const pendingCount = kycSubmissions.filter(s => s.status === 'pending').length;
  const approvedToday = kycSubmissions.filter(s => s.status === 'approved').length;
  const rejectedCount = kycSubmissions.filter(s => s.status === 'rejected').length;

  return (
    <div className="space-y-6">
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">KYC Document Review</CardTitle>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="text-slate-600">Pending: <strong>{pendingCount}</strong></span>
            <span className="text-slate-600">Approved Today: <strong>{approvedToday}</strong></span>
            <span className="text-slate-600">Rejected: <strong>{rejectedCount}</strong></span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {kycSubmissions.map((submission) => (
              <div key={submission.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 truncate">{submission.user}</p>
                      <p className="text-sm text-slate-600 truncate">{submission.email}</p>
                      <p className="text-xs text-slate-500">Submitted: {submission.submittedAt}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {submission.documents.map((doc, index) => (
                        <Badge key={index} variant="outline" className="text-xs whitespace-nowrap">
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <Badge 
                      variant={submission.riskLevel === 'high' ? 'destructive' : 
                               submission.riskLevel === 'medium' ? 'secondary' : 'default'}
                      className={`whitespace-nowrap ${
                        submission.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                        submission.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}
                    >
                      {submission.riskLevel.toUpperCase()} RISK
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSubmission(submission)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 whitespace-nowrap"
                      >
                        Review
                      </Button>
                      {submission.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(submission.id, submission.user)}
                            className="text-red-600 border-red-200 hover:bg-red-50 whitespace-nowrap"
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(submission.id, submission.user)}
                            className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
                          >
                            Approve
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Document Review Modal */}
      {selectedSubmission && (
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900">Document Review - {selectedSubmission.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-slate-900 mb-3">User Information</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {selectedSubmission.user}</p>
                  <p><strong>Email:</strong> {selectedSubmission.email}</p>
                  <p><strong>Submitted:</strong> {selectedSubmission.submittedAt}</p>
                  <p><strong>Risk Level:</strong> 
                    <Badge className={`ml-2 ${
                      selectedSubmission.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                      selectedSubmission.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {selectedSubmission.riskLevel.toUpperCase()}
                    </Badge>
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Submitted Documents</h4>
                <div className="space-y-2">
                  {selectedSubmission.documents.map((doc: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                      <span className="text-sm">{doc}</span>
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={() => setSelectedSubmission(null)}
                className="order-2 sm:order-1"
              >
                Close
              </Button>
              {selectedSubmission.status === 'pending' && (
                <div className="flex gap-3 order-1 sm:order-2">
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedSubmission.id, selectedSubmission.user)}
                    className="text-red-600 border-red-200 hover:bg-red-50 flex-1 sm:flex-none"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleApprove(selectedSubmission.id, selectedSubmission.user)}
                    className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
                  >
                    Approve
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <AdminActionConfirm
        isOpen={confirmAction.isOpen}
        onClose={closeConfirm}
        action={confirmAction.action}
        targetId={confirmAction.targetId}
        targetName={confirmAction.targetName}
        onSuccess={() => setSelectedSubmission(null)}
      />
    </div>
  );
};

export default KYCManagement;
