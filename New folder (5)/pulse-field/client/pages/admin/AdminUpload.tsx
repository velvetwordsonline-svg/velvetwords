import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminUpload() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: 'slow-emotional'
  });

  const categorySubcategories = {
    'slow-emotional': ['Slow Burn Romance', 'Emotional Journey', 'Deep Connection', 'Heartfelt Stories'],
    'forbidden-risky': ['Forbidden Love', 'Risky Affairs', 'Secret Romance', 'Dangerous Attraction'],
    'midnight-confession': ['Midnight Tales', 'Confession Stories', 'Late Night Romance', 'Secret Admissions'],
    'everyday-chemistry': ['Daily Life Romance', 'Chemistry Stories', 'Ordinary Love', 'Simple Moments'],
    'city-travel': ['City Romance', 'Travel Stories', 'Temporary Love', 'Urban Tales'],
    'power-elite': ['Power Dynamics', 'Elite Lives', 'Identity Stories', 'High Society']
  };

  const handleCategoryChange = (newCategory: string) => {
    setFormData({
      ...formData,
      category: newCategory,
      author: categorySubcategories[newCategory as keyof typeof categorySubcategories][0]
    });
  };
  const [files, setFiles] = useState({ document: null, thumbnail: null });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('author', formData.author);
      uploadData.append('description', formData.description);
      uploadData.append('category', formData.category);
      if (files.document) uploadData.append('document', files.document);
      if (files.thumbnail) uploadData.append('thumbnail', files.thumbnail);

      const token = localStorage.getItem('adminToken');
      const response = await fetch('https://velvetwords-backend.vercel.app/api/admin/upload-story', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: uploadData
      });

      if (response.ok) {
        alert('Story uploaded successfully!');
        navigate('/admin/dashboard');
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Gradient divider line */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-purple-600 to-transparent opacity-50" />
      
      <nav className="bg-[#050505] shadow mb-8 border-b border-purple-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto bg-[#050505] p-8 rounded-xl shadow-[0_0_30px_rgba(124,58,237,0.3)] border border-purple-600">
        <h1 className="text-2xl font-bold mb-6 text-white">Upload New Story</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Title
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Subcategory
            </label>
            <select
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
            >
              {categorySubcategories[formData.category as keyof typeof categorySubcategories].map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              required
              rows={4}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Category
            </label>
            <select
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="slow-emotional">Slow & Emotional Romance</option>
              <option value="forbidden-risky">Forbidden & Risky Desire</option>
              <option value="midnight-confession">Midnight & Confession Stories</option>
              <option value="everyday-chemistry">Everyday Chemistry</option>
              <option value="city-travel">City, Travel & Temporary Love</option>
              <option value="power-elite">Power, Identity & Elite Lives</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Story Document (DOCX)
            </label>
            <input
              type="file"
              accept=".docx"
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setFiles({...files, document: e.target.files?.[0] || null})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Thumbnail Image
            </label>
            <input
              type="file"
              accept="image/*"
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setFiles({...files, thumbnail: e.target.files?.[0] || null})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {loading ? 'Uploading...' : 'Upload Story'}
          </button>
        </form>
      </div>
    </div>
  );
}