import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Edit2, Share2, MoreVertical } from 'lucide-react';

const DocumentViewPage = () => {
  const { workspaceId, documentId } = useParams<{ workspaceId: string; documentId: string }>();
  const [document] = useState(null);

  if (!document) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Document not found</h3>
          <p className="text-gray-500">This document doesn't exist or you don't have access to it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Document Title</h2>
        <div className="flex items-center space-x-2">
          <button className="btn btn-outline">
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </button>
          <button className="btn btn-primary">
            <Edit2 className="w-5 h-5 mr-2" />
            Edit
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="prose max-w-none">
        {/* Document content will go here */}
        <p className="text-gray-600">Document content loading...</p>
      </div>
    </div>
  );
};

export default DocumentViewPage;