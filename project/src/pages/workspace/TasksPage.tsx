import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, List, Kanban } from 'lucide-react';

const TasksPage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [tasks] = useState([]);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('board');

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
        <div className="flex items-center space-x-4">
          <div className="bg-gray-100 rounded-lg p-1">
            <button
              className={`px-3 py-1.5 rounded ${
                viewMode === 'list'
                  ? 'bg-white shadow text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setViewMode('list')}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              className={`px-3 py-1.5 rounded ${
                viewMode === 'board'
                  ? 'bg-white shadow text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setViewMode('board')}
            >
              <Kanban className="w-5 h-5" />
            </button>
          </div>
          <button className="btn btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            New Task
          </button>
        </div>
      </div>

      {tasks.length > 0 ? (
        <div className={viewMode === 'board' ? 'flex space-x-4 overflow-x-auto pb-4' : 'space-y-4'}>
          {/* Tasks will go here */}
        </div>
      ) : (
        <div className="text-center py-12">
          <Kanban className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-500 mb-4">Create your first task to get started</p>
          <button className="btn btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            Create Task
          </button>
        </div>
      )}
    </div>
  );
};

export default TasksPage;