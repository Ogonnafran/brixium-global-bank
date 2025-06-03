
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface KYCSubmission {
  id: string;
  user: string;
  email: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

const KYCManagement: React.FC = () => {
  const [selectedSubmission, setSelectedSubmission] = useState<KYCSubmission | null>(null);
  
  const kycSubmissions: KYCSubmission[] = [
    {
      id: 'KYC001',
      user: 'John Doe',
      email: 'john.doe@email.com',
      submittedAt: '2024-06-03 10:30',
      status: 'pending',
      documents: ['Passport', 'Utility Bill'],
      riskLevel: 'low'
    },
    {
      id: 'KYC002',
      user: 'Jane Smith',
      email: 'jane.smith@email.com',
      submittedAt: '2024-06-03 09:15',
      status: 'pending',
      documents: ['Driver License', 'Bank Statement'],
      riskLevel: 'medium'
    },
    {
      id: 'KYC003',
      user: 'Mike Johnson',
      email: 'mike.j@email.com',
      submittedAt: '2024-06-03 08:45',
      status: 'pending',
      documents: ['National ID', 'Proof of Address'],
      riskLevel: 'high'
    },
  ];

  const handleApprove = (id: string) => {
    console.log('Approving KYC:', id);
  };

  const handleReject = (id: string) => {
    console.log('Rejecting KYC:', id);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">KYC Document Review</CardTitle>
          <div className="flex space-x-4 text-sm">
            <span className="text-slate-600">Pending: <strong>23</strong></span>
            <span className="text-slate-600">Approved Today: <strong>45</strong></span>
            <span className="text-slate-600">Rejected: <strong>2</strong></span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {kycSubmissions.map((submission) => (
              <div key={submission.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium text-slate-900">{submission.user}</p>
                      <p className="text-sm text-slate-600">{submission.email}</p>
                      <p className="text-xs text-slate-500">Submitted: {submission.submittedAt}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {submission.documents.map((doc, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {doc}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant={submission.riskLevel === 'high' ? 'destructive' : 
                               submission.riskLevel === 'medium' ? 'secondary' : 'default'}
                      className={`${
                        submission.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                        submission.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}
                    >
                      {submission.riskLevel.toUpperCase()} RISK
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSubmission(submission)}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      Review
                    </Button>
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
            <div className="grid grid-cols-2 gap-6">
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
                  {selectedSubmission.documents.map((doc, index) => (
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
            <div className="flex justify-between mt-6 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={() => setSelectedSubmission(null)}
              >
                Close
              </Button>
              <div className="space-x-3">
                <Button
                  variant="outline"
                  onClick={() => handleReject(selectedSubmission.id)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(selectedSubmission.id)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Approve
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KYCManagement;
