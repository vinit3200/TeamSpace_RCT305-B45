import { Outlet } from 'react-router-dom';
import { Users, LayoutGrid, FileText, MessageCircle } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="flex flex-col md:flex-row w-full">
        {/* Left side - Branding and Features */}
        <div className="hidden md:flex md:w-1/2 bg-primary-600 text-white p-8 flex-col justify-between">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-white p-2 rounded-lg">
                <LayoutGrid className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="text-3xl font-bold">TeamSpace</h1>
            </div>
            <h2 className="text-2xl font-semibold mb-6">Transform the way your team collaborates</h2>
            <p className="text-primary-100 mb-8">
              A unified workspace for your documents, tasks, and team communication. Streamline your workflow and boost productivity.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary-500 p-2 rounded-lg mt-1">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Document Collaboration</h3>
                  <p className="text-primary-100">Work together on documents in real-time with your team members.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary-500 p-2 rounded-lg mt-1">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Team Management</h3>
                  <p className="text-primary-100">Organize your team with customizable workspaces and permissions.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-primary-500 p-2 rounded-lg mt-1">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Integrated Communication</h3>
                  <p className="text-primary-100">Chat with your team directly within your workspace.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-auto">
            <p className="text-primary-200 text-sm">© 2025 TeamSpace. All rights reserved.</p>
          </div>
        </div>
        
        {/* Right side - Auth forms */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-md fade-in">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;