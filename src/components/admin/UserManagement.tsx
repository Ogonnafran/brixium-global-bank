
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
  status: 'active' | 'locked' | 'suspended';
  kycStatus: 'pending' | 'approved' | 'rejected';
  flagged: boolean;
  adminNotes: string;
}

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newNote, setNewNote] = useState('');

  const users: User[] = [
    {
      id: 'USR001',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      joinedAt: '2024-05-15',
      status: 'active',
      kycStatus: 'approved',
      flagged: false,
      adminNotes: 'High-value customer, excellent standing.'
    },
    {
      id: 'USR002',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '+1 (555) 987-6543',
      joinedAt: '2024-05-20',
      status: 'locked',
      kycStatus: 'approved',
      flagged: true,
      adminNotes: 'Multiple failed login attempts. Account locked for security.'
    },
    {
      id: 'USR003',
      name: 'Mike Johnson',
      email: 'mike.johnson@email.com',
      phone: '+1 (555) 456-7890',
      joinedAt: '2024-06-01',
      status: 'active',
      kycStatus: 'pending',
      flagged: false,
      adminNotes: ''
    },
  ];

  const handleLockAccount = (userId: string) => {
    console.log('Locking account:', userId);
  };

  const handleUnlockAccount = (userId: string) => {
    console.log('Unlocking account:', userId);
  };

  const handleResetPassword = (userId: string) => {
    console.log('Resetting password for:', userId);
  };

  const handleAddNote = () => {
    if (selectedUser && newNote.trim()) {
      console.log('Adding note for user:', selectedUser.id, newNote);
      setNewNote('');
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card className="bg-white border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search by email, phone, or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button variant="outline">Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <Card className="bg-white border-slate-200">
        <CardContent className="p-0">
          <div className="space-y-0">
            {filteredUsers.map((user) => (
              <div key={user.id} className={`p-4 border-b border-slate-200 last:border-b-0 ${
                user.flagged ? 'bg-red-50' : ''
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-slate-900">{user.name}</p>
                        {user.flagged && <span className="text-red-500">🚩</span>}
                      </div>
                      <p className="text-sm text-slate-600">{user.email}</p>
                      <p className="text-xs text-slate-500">{user.phone}</p>
                      <p className="text-xs text-slate-500">Joined: {user.joinedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                      {user.status.toUpperCase()}
                    </Badge>
                    <Badge variant={user.kycStatus === 'approved' ? 'default' : 'secondary'}>
                      KYC: {user.kycStatus.toUpperCase()}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Management Modal */}
      {selectedUser && (
        <Card className="bg-white border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900">Manage User - {selectedUser.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-slate-900 mb-3">User Information</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>ID:</strong> {selectedUser.id}</p>
                  <p><strong>Name:</strong> {selectedUser.name}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Phone:</strong> {selectedUser.phone}</p>
                  <p><strong>Joined:</strong> {selectedUser.joinedAt}</p>
                  <p><strong>Status:</strong> 
                    <Badge className="ml-2" variant={selectedUser.status === 'active' ? 'default' : 'destructive'}>
                      {selectedUser.status.toUpperCase()}
                    </Badge>
                  </p>
                  <p><strong>KYC:</strong> 
                    <Badge className="ml-2" variant={selectedUser.kycStatus === 'approved' ? 'default' : 'secondary'}>
                      {selectedUser.kycStatus.toUpperCase()}
                    </Badge>
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Admin Actions</h4>
                <div className="space-y-3">
                  {selectedUser.status === 'locked' ? (
                    <Button
                      onClick={() => handleUnlockAccount(selectedUser.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Unlock Account
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => handleLockAccount(selectedUser.id)}
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Lock Account
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => handleResetPassword(selectedUser.id)}
                    className="w-full"
                  >
                    Reset Password
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Transaction History
                  </Button>
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <h4 className="font-medium text-slate-900 mb-3">Admin Notes</h4>
              {selectedUser.adminNotes && (
                <div className="bg-slate-50 p-3 rounded-lg mb-3">
                  <p className="text-sm text-slate-700">{selectedUser.adminNotes}</p>
                </div>
              )}
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                  Add Note
                </Button>
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserManagement;
