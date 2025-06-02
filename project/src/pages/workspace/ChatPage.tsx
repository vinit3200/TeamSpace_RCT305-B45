import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Plus, Hash } from 'lucide-react';

const ChatPage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [message, setMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // Send message logic will go here
    setMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-16rem)]">
      {/* Channels Sidebar */}
      <div className="w-64 border-r border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">Channels</h3>
          <button className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-1">
          <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-md">
            <Hash className="w-4 h-4 mr-2 text-gray-500" />
            general
          </button>
          <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md">
            <Hash className="w-4 h-4 mr-2 text-gray-500" />
            random
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="text-center py-12 text-gray-500">
            <Hash className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to #general</h3>
            <p>This is the start of the #general channel.</p>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSend} className="flex space-x-4">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 form-input"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="btn btn-primary"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;