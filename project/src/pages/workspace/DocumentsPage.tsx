import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Plus } from 'lucide-react';

const DocumentsPage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [documents] = useState([]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Documents</h2>
        <button className="btn btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          New Document
        </button>
      </div>

      {documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Document cards will go here */}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
          <p className="text-gray-500 mb-4">Create your first document to get started</p>
          <button className="btn btn-primary">
            <Plus className="w-5 h-5 mr-2" />
            Create Document
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;