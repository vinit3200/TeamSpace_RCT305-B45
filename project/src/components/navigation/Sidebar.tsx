import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  FileText, 
  CheckSquare, 
  MessageCircle, 
  Users, 
  ChevronDown,
  ChevronRight,
  PlusCircle,
  Settings
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

interface Workspace {
  id: string;
  name: string;
  createdBy: string;
}

const Sidebar = ({ isOpen, closeSidebar }: SidebarProps) => {
  const { user } = useAuth();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const location = useLocation();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isWorkspacesOpen, setIsWorkspacesOpen] = useState(true);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!user) return;
      
      try {
        // Query workspaces where the user is a member
        const memberWorkspacesQuery = query(
          collection(db, 'workspaceMembers'),
          where('userId', '==', user.uid)
        );
        
        const memberWorkspacesSnapshot = await getDocs(memberWorkspacesQuery);
        const workspaceIds = memberWorkspacesSnapshot.docs.map(doc => doc.data().workspaceId);
        
        if (workspaceIds.length === 0) {
          setWorkspaces([]);
          return;
        }
        
        // Get workspace details
        const workspacesData: Workspace[] = [];
        
        for (const id of workspaceIds) {
          const workspaceQuery = query(
            collection(db, 'workspaces'),
            where('id', '==', id)
          );
          
          const workspaceSnapshot = await getDocs(workspaceQuery);
          
          workspaceSnapshot.forEach(doc => {
            workspacesData.push({ id: doc.id, ...doc.data() } as Workspace);
          });
        }
        
        setWorkspaces(workspacesData);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
      }
    };
    
    fetchWorkspaces();
  }, [user]);

  // Determine if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Handle workspace section toggle
  const toggleWorkspaces = () => {
    setIsWorkspacesOpen(!isWorkspacesOpen);
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-900 bg-opacity-50 transition-opacity md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-20 w-64 transform bg-white border-r border-gray-200 pt-16 pb-4 transition duration-300 ease-in-out md:relative md:translate-x-0 md:pt-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col overflow-y-auto">
          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            <Link
              to="/dashboard"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/dashboard')
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={closeSidebar}
            >
              <LayoutGrid className="mr-3 h-5 w-5 text-gray-500" aria-hidden="true" />
              Dashboard
            </Link>

            {/* Workspaces Section */}
            <div className="space-y-1">
              <button
                type="button"
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-left text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none"
                onClick={toggleWorkspaces}
              >
                {isWorkspacesOpen ? (
                  <ChevronDown className="mr-3 h-5 w-5 text-gray-500\" aria-hidden="true" />
                ) : (
                  <ChevronRight className="mr-3 h-5 w-5 text-gray-500\" aria-hidden="true" />
                )}
                Workspaces
              </button>

              {/* Workspace List */}
              {isWorkspacesOpen && (
                <div className="pl-5 space-y-1">
                  {workspaces.length > 0 ? (
                    workspaces.map((workspace) => (
                      <Link
                        key={workspace.id}
                        to={`/workspaces/${workspace.id}`}
                        className={`flex items-center pl-3 pr-2 py-2 text-sm font-medium rounded-md ${
                          workspaceId === workspace.id
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={closeSidebar}
                      >
                        <span className="truncate">{workspace.name}</span>
                      </Link>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-sm text-gray-500 italic">No workspaces yet</p>
                  )}

                  {/* Create Workspace Link */}
                  <Link
                    to="/dashboard?newWorkspace=true"
                    className="flex items-center pl-3 pr-2 py-2 text-sm font-medium text-primary-600 hover:bg-gray-100 rounded-md"
                    onClick={closeSidebar}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                    <span>New Workspace</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Workspace Specific Navigation */}
            {workspaceId && (
              <div className="pt-2 mt-2 border-t border-gray-200">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Workspace
                </h3>
                <div className="mt-2 space-y-1">
                  <Link
                    to={`/workspaces/${workspaceId}/documents`}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      location.pathname.includes(`/workspaces/${workspaceId}/documents`)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={closeSidebar}
                  >
                    <FileText className="mr-3 h-5 w-5 text-gray-500" aria-hidden="true" />
                    Documents
                  </Link>
                  <Link
                    to={`/workspaces/${workspaceId}/tasks`}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      location.pathname.includes(`/workspaces/${workspaceId}/tasks`)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={closeSidebar}
                  >
                    <CheckSquare className="mr-3 h-5 w-5 text-gray-500" aria-hidden="true" />
                    Tasks
                  </Link>
                  <Link
                    to={`/workspaces/${workspaceId}/chat`}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      location.pathname.includes(`/workspaces/${workspaceId}/chat`)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={closeSidebar}
                  >
                    <MessageCircle className="mr-3 h-5 w-5 text-gray-500" aria-hidden="true" />
                    Chat
                  </Link>
                  <Link
                    to={`/workspaces/${workspaceId}/members`}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      location.pathname.includes(`/workspaces/${workspaceId}/members`)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={closeSidebar}
                  >
                    <Users className="mr-3 h-5 w-5 text-gray-500" aria-hidden="true" />
                    Members
                  </Link>
                </div>
              </div>
            )}
          </nav>

          {/* Settings */}
          <div className="px-3 py-3 mt-auto border-t border-gray-200">
            <Link
              to="/settings"
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/settings')
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={closeSidebar}
            >
              <Settings className="mr-3 h-5 w-5 text-gray-500" aria-hidden="true" />
              Settings
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;