import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Save, Eye } from 'lucide-react';

const DocumentEditPage = () => {
  const { workspaceId, documentId } = useParams<{ workspaceId: string; documentId: string }>();
  const [document] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Save logic will go here
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <input
          type="text"
          placeholder="Document Title"
          className="text-xl font-semibold bg-transparent border-0 focus:ring-0 p-0 focus:outline-none"
          defaultValue="Untitled Document"
        />
        <div className="flex items-center space-x-2">
          <button className="btn btn-outline">
            <Eye className="w-5 h-5 mr-2" />
            Preview
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save
              </>
            )}
          </button>
        </div>
      </div>

      <div className="min-h-[500px] border rounded-lg p-4">
        {/* Editor will go here */}
        <p className="text-gray-600">Editor loading...</p>
      </div>
    </div>
  );
};

export default DocumentEditPage;