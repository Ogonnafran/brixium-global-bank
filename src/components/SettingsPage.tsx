
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const SettingsPage: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>

      {/* Profile Section */}
      <div className="card-glow rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Profile</h3>
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-white">U</span>
          </div>
          <div>
            <p className="text-white font-semibold">John Doe</p>
            <p className="text-gray-400">john.doe@example.com</p>
            <p className="text-gray-400 text-sm">+1 (555) 123-4567</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
        >
          Edit Profile
        </Button>
      </div>

      {/* Security Section */}
      <div className="card-glow rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Security</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Biometric Authentication</p>
              <p className="text-gray-400 text-sm">Use fingerprint or Face ID</p>
            </div>
            <Switch
              checked={biometric}
              onCheckedChange={setBiometric}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Two-Factor Authentication</p>
              <p className="text-gray-400 text-sm">Add extra security layer</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-lg"
            >
              Setup
            </Button>
          </div>

          <button className="w-full text-left py-3 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Change Password</p>
              <p className="text-gray-400 text-sm">Update your password</p>
            </div>
            <span className="text-gray-400">→</span>
          </button>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="card-glow rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Push Notifications</p>
              <p className="text-gray-400 text-sm">Transaction alerts and updates</p>
            </div>
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Dark Mode</p>
              <p className="text-gray-400 text-sm">App appearance</p>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>

          <button className="w-full text-left py-3 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Language</p>
              <p className="text-gray-400 text-sm">English (US)</p>
            </div>
            <span className="text-gray-400">→</span>
          </button>

          <button className="w-full text-left py-3 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Currency Display</p>
              <p className="text-gray-400 text-sm">USD Primary</p>
            </div>
            <span className="text-gray-400">→</span>
          </button>
        </div>
      </div>

      {/* Support Section */}
      <div className="card-glow rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
        <div className="space-y-3">
          <button className="w-full text-left py-3 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Help Center</p>
              <p className="text-gray-400 text-sm">FAQs and guides</p>
            </div>
            <span className="text-gray-400">→</span>
          </button>

          <button className="w-full text-left py-3 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Contact Support</p>
              <p className="text-gray-400 text-sm">Get help from our team</p>
            </div>
            <span className="text-gray-400">→</span>
          </button>

          <button className="w-full text-left py-3 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Terms & Privacy</p>
              <p className="text-gray-400 text-sm">Legal information</p>
            </div>
            <span className="text-gray-400">→</span>
          </button>
        </div>
      </div>

      {/* Account Actions */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl py-4"
        >
          Export Account Data
        </Button>
        
        <Button
          variant="destructive"
          className="w-full bg-red-500/20 border-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl py-4"
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
