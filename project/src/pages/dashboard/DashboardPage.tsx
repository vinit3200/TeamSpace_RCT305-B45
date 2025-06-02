import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlusCircle, Folder, Clock, Users, CheckCircle, AlertTriangle, FileText, MessageCircle } from 'lucide-react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

interface Workspace {
  id: string;
  name: string;
  description: string;
  createdAt: any;
  createdBy: string;
  creatorName: string;
  memberCount: number;
}

interface RecentActivity {
  id: string;
  type: 'document' | 'task' | 'comment';
  title: string;
  workspaceId: string;
  workspaceName: string;
  createdAt: any;
  createdBy: string;
  creatorName: string;
}

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [showNewWorkspaceModal, setShowNewWorkspaceModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('');

  // Check URL params for new workspace modal
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('newWorkspace') === 'true') {
      setShowNewWorkspaceModal(true);
    }
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        // Fetch workspaces
        const workspaceMembers = query(
          collection(db, 'workspaceMembers'),
          where('userId', '==', user.uid)
        );
        
        const membershipSnapshot = await getDocs(workspaceMembers);
        const workspaceIds = membershipSnapshot.docs.map(doc => doc.data().workspaceId);
        
        if (workspaceIds.length > 0) {
          const workspacesData: Workspace[] = [];
          
          for (const workspaceId of workspaceIds) {
            // Get workspace document directly using its ID
            const workspaceDoc = await getDoc(doc(db, 'workspaces', workspaceId));
            
            if (workspaceDoc.exists()) {
              const workspaceData = workspaceDoc.data();
              
              // Get member count
              const membersQuery = query(
                collection(db, 'workspaceMembers'),
                where('workspaceId', '==', workspaceId)
              );
              
              const membersSnapshot = await getDocs(membersQuery);
              
              workspacesData.push({
                id: workspaceDoc.id,
                name: workspaceData.name,
                description: workspaceData.description,
                createdAt: workspaceData.createdAt,
                createdBy: workspaceData.createdBy,
                creatorName: workspaceData.creatorName,
                memberCount: membersSnapshot.size
              });
            }
          }
          
          // Sort by most recently created
          workspacesData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
          
          setWorkspaces(workspacesData);
        }
        
        // Fetch recent activity
        // This would normally fetch documents, tasks, comments, etc.
        // For demo purposes, we'll just use a placeholder
        
        setRecentActivity([
          {
            id: '1',
            type: 'document',
            title: 'Project Proposal',
            workspaceId: 'workspace1',
            workspaceName: 'Marketing Team',
            createdAt: { seconds: Date.now() / 1000 - 3600 },
            createdBy: 'user1',
            creatorName: 'Jane Smith'
          },
          {
            id: '2',
            type: 'task',
            title: 'Design Homepage',
            workspaceId: 'workspace2',
            workspaceName: 'Design Team',
            createdAt: { seconds: Date.now() / 1000 - 7200 },
            createdBy: 'user2',
            creatorName: 'John Doe'
          },
          {
            id: '3',
            type: 'comment',
            title: 'Feedback on Q1 Report',
            workspaceId: 'workspace1',
            workspaceName: 'Marketing Team',
            createdAt: { seconds: Date.now() / 1000 - 10800 },
            createdBy: 'user3',
            creatorName: 'Alex Johnson'
          }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const createWorkspace = async () => {
    if (!user) return;
    
    if (!newWorkspaceName.trim()) {
      toast.error('Please enter a workspace name');
      return;
    }
    
    setIsCreatingWorkspace(true);
    
    try {
      // Create workspace document
      const workspaceRef = await addDoc(collection(db, 'workspaces'), {
        name: newWorkspaceName.trim(),
        description: newWorkspaceDescription.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user.uid,
        creatorName: user.displayName || 'User'
      });
      
      // Add current user as admin member
      await addDoc(collection(db, 'workspaceMembers'), {
        workspaceId: workspaceRef.id,
        userId: user.uid,
        role: 'admin',
        joinedAt: serverTimestamp()
      });
      
      toast.success('Workspace created successfully!');
      setShowNewWorkspaceModal(false);
      setNewWorkspaceName('');
      setNewWorkspaceDescription('');
      
      // Navigate to the new workspace
      navigate(`/workspaces/${workspaceRef.id}`);
    } catch (error) {
      console.error('Error creating workspace:', error);
      toast.error('Failed to create workspace');
    } finally {
      setIsCreatingWorkspace(false);
    }
  };

  const formatDate = (seconds: number) => {
    const date = new Date(seconds * 1000);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl sm:truncate">Dashboard</h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={() => setShowNewWorkspaceModal(true)}
            className="btn btn-primary"
          >
            <PlusCircle className="w-5 h-5 mr-1" />
            New Workspace
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Workspaces</h2>
            {workspaces.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {workspaces.map((workspace) => (
                  <div
                    key={workspace.id}
                    onClick={() => navigate(`/workspaces/${workspace.id}`)}
                    className="card p-5 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary-100 p-2 rounded-lg">
                        <Folder className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">{workspace.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{workspace.description}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                          <span>{workspace.memberCount} {workspace.memberCount === 1 ? 'member' : 'members'}</span>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                          <span>Created {workspace.createdAt ? formatDate(workspace.createdAt.seconds) : 'Recently'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card p-6 text-center">
                <Folder className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No workspaces yet</h3>
                <p className="text-gray-500 mb-4">Create your first workspace to get started</p>
                <button
                  type="button"
                  onClick={() => setShowNewWorkspaceModal(true)}
                  className="btn btn-primary mx-auto"
                >
                  <PlusCircle className="w-5 h-5 mr-1" />
                  Create Workspace
                </button>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
            <div className="card divide-y divide-gray-200">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="p-4 flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'document'
                        ? 'bg-primary-100 text-primary-600'
                        : activity.type === 'task'
                        ? 'bg-success-100 text-success-600'
                        : 'bg-accent-100 text-accent-600'
                    }`}>
                      {activity.type === 'document' ? (
                        <FileText className="w-5 h-5" />
                      ) : activity.type === 'task' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <MessageCircle className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.creatorName} in {activity.workspaceName}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.createdAt
                          ? new Date(activity.createdAt.seconds * 1000).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })
                          : 'Recently'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No recent activity</h3>
                  <p className="text-gray-500">Activities will appear here as you work</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Status Overview */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Status Overview</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="card p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-10 w-10 text-success-500" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed Tasks</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">12</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="card p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-10 w-10 text-warning-500" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Tasks</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">8</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          
          <div className="card p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-10 w-10 text-primary-500" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Team Members</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">5</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Workspace Modal */}
      {showNewWorkspaceModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 slide-up">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                  <PlusCircle className="h-6 w-6 text-primary-600" aria-hidden="true" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Create a new workspace</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Create a new workspace to collaborate with your team on documents, tasks, and more.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="workspace-name" className="block text-sm font-medium text-gray-700">
                      Workspace name <span className="text-error-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="workspace-name"
                      id="workspace-name"
                      value={newWorkspaceName}
                      onChange={(e) => setNewWorkspaceName(e.target.value)}
                      className="form-input mt-1"
                      placeholder="Marketing Team, Project X, etc."
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="workspace-description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="workspace-description"
                      name="workspace-description"
                      rows={3}
                      value={newWorkspaceDescription}
                      onChange={(e) => setNewWorkspaceDescription(e.target.value)}
                      className="form-input mt-1"
                      placeholder="What is this workspace for?"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={createWorkspace}
                  disabled={isCreatingWorkspace || !newWorkspaceName.trim()}
                  className="btn btn-primary w-full sm:col-start-2"
                >
                  {isCreatingWorkspace ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Creating...
                    </>
                  ) : (
                    'Create Workspace'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewWorkspaceModal(false);
                    // Remove the URL parameter
                    const searchParams = new URLSearchParams(location.search);
                    searchParams.delete('newWorkspace');
                    navigate({
                      pathname: location.pathname,
                      search: searchParams.toString()
                    });
                  }}
                  className="btn btn-outline w-full sm:col-start-1 mt-3 sm:mt-0"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;