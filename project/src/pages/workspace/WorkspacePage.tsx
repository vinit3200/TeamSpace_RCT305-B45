import { useState, useEffect } from 'react';
import { useParams, Link, Outlet } from 'react-router-dom';
import { FileText, CheckSquare, MessageCircle, Users, Settings } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../hooks/useAuth';

interface Workspace {
  id: string;
  name: string;
  description: string;
  createdAt: any;
  createdBy: string;
  creatorName: string;
}

const WorkspacePage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { user } = useAuth();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspace = async () => {
      if (!workspaceId) return;

      try {
        const workspaceDoc = await getDoc(doc(db, 'workspaces', workspaceId));
        
        if (workspaceDoc.exists()) {
          setWorkspace({
            id: workspaceDoc.id,
            ...workspaceDoc.data()
          } as Workspace);
        }
      } catch (error) {
        console.error('Error fetching workspace:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspace();
  }, [workspaceId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Workspace not found</h2>
        <p className="mt-2 text-gray-600">The workspace you're looking for doesn't exist or you don't have access to it.</p>
        <Link to="/dashboard" className="mt-4 btn btn-primary inline-flex">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{workspace.name}</h1>
        {workspace.description && (
          <p className="mt-2 text-gray-600">{workspace.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link
          to={`/workspaces/${workspaceId}/documents`}
          className="card p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Documents</h3>
              <p className="text-sm text-gray-500">Create and edit documents</p>
            </div>
          </div>
        </Link>

        <Link
          to={`/workspaces/${workspaceId}/tasks`}
          className="card p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-success-100 p-3 rounded-lg">
              <CheckSquare className="h-6 w-6 text-success-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Tasks</h3>
              <p className="text-sm text-gray-500">Manage team tasks</p>
            </div>
          </div>
        </Link>

        <Link
          to={`/workspaces/${workspaceId}/chat`}
          className="card p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-accent-100 p-3 rounded-lg">
              <MessageCircle className="h-6 w-6 text-accent-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Chat</h3>
              <p className="text-sm text-gray-500">Team communication</p>
            </div>
          </div>
        </Link>

        <Link
          to={`/workspaces/${workspaceId}/members`}
          className="card p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-secondary-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-secondary-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Members</h3>
              <p className="text-sm text-gray-500">Manage team members</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="card">
        <Outlet />
      </div>
    </div>
  );
};

export default WorkspacePage;