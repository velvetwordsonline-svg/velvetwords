import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// API Configuration
const API_BASE = 'http://localhost:5001/api';

// Helper function to convert file to base64
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export default function AdminUpload() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditing = !!editId;
  
  const [formData, setFormData] = useState({
    title: '',
    author: 'Office Chemistry',
    description: '',
    category: 'everyday-chemistry'
  });

  // Load story data if editing
  useEffect(() => {
    if (isEditing && editId) {
      const stories = JSON.parse(localStorage.getItem('stories') || '[]');
      const storyToEdit = stories.find((s: any) => s.id === editId);
      if (storyToEdit) {
        setFormData({
          title: storyToEdit.title,
          author: storyToEdit.author,
          description: storyToEdit.description,
          category: storyToEdit.category
        });
      }
    }
  }, [isEditing, editId]);

  const categorySubcategories = {
    'everyday-chemistry': ['Office Chemistry', 'Unspoken Desire'],
    'slow-emotional': ['One Last Goodbye', 'Slow Burn Romance', 'Second Chance Love', 'Slow Burn Romance/Age Gap Romance'],
    'city-travel': ['City Love Story', 'Travel & Temporary Love'],
    'forbidden-risky': ['Age Gap Romance', 'Mind Games & Attraction', 'Secret Affair', 'Artistic Souls', 'Therapist–Client Tension', 'Rivalry', 'Identity & Desire'],
    'midnight-confession': ['Midnight Encounters'],
    'power-elite': ['Royal & Elite Lives']
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
      if (isEditing && editId) {
        // Update existing story (localStorage only for now)
        const existingStories = JSON.parse(localStorage.getItem('stories') || '[]');
        
        let newCoverImage = null;
        if (files.thumbnail) {
          newCoverImage = await convertFileToBase64(files.thumbnail);
        }
        
        const updatedStories = existingStories.map((story: any) => {
          if (story.id === editId) {
            return {
              ...story,
              title: formData.title,
              author: formData.author,
              description: formData.description,
              category: formData.category,
              coverImage: newCoverImage || story.coverImage
            };
          }
          return story;
        });
        
        localStorage.setItem('stories', JSON.stringify(updatedStories));
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'stories',
          newValue: JSON.stringify(updatedStories)
        }));
        
        alert('Story updated successfully!');
      } else {
        // Create new story with DOCX processing
        if (!files.document) {
          alert('Please select a DOCX file');
          return;
        }
        
        // Create FormData for backend upload
        const uploadData = new FormData();
        uploadData.append('title', formData.title);
        uploadData.append('author', formData.author);
        uploadData.append('description', formData.description);
        uploadData.append('category', formData.category);
        uploadData.append('document', files.document);
        if (files.thumbnail) {
          uploadData.append('thumbnail', files.thumbnail);
        }
        
        // Get admin token (assuming stored in localStorage)
        const adminToken = localStorage.getItem('adminToken');
        
        // Upload to backend
        const response = await fetch(`${API_BASE}/admin/upload-story`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminToken}`
          },
          body: uploadData
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }
        
        const result = await response.json();
        console.log('Upload successful:', result);
        
        // Also add to localStorage for immediate display
        const newStory = {
          id: result.storyId,
          title: formData.title,
          author: formData.author,
          description: formData.description,
          category: formData.category,
          coverImage: files.thumbnail ? await convertFileToBase64(files.thumbnail) : null,
          totalChapters: 1, // Will be updated by backend
          createdAt: new Date().toISOString()
        };
        
        const existingStories = JSON.parse(localStorage.getItem('stories') || '[]');
        existingStories.push(newStory);
        localStorage.setItem('stories', JSON.stringify(existingStories));
        
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'stories',
          newValue: JSON.stringify(existingStories)
        }));
        
        alert('Story uploaded and processed successfully! Chapters have been automatically created.');
      }
      
      navigate('/categories');
      
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error}`);
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
        <h1 className="text-2xl font-bold mb-6 text-white">
          {isEditing ? 'Edit Story' : 'Upload New Story'}
        </h1>
        
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
              {categorySubcategories[formData.category as keyof typeof categorySubcategories]?.map((subcategory) => (
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
              <option value="everyday-chemistry">Everyday Chemistry</option>
              <option value="slow-emotional">Slow & Emotional</option>
              <option value="city-travel">City Travel & Temporary Love</option>
              <option value="forbidden-risky">Forbidden & Risky Desire</option>
              <option value="midnight-confession">Midnight & Confession</option>
              <option value="power-elite">Power Identity & Elite Lives</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Story Document (DOCX) {!isEditing && <span className="text-red-400">*</span>}
            </label>
            <input
              type="file"
              accept=".docx,.doc"
              required={!isEditing}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setFiles({...files, document: e.target.files?.[0] || null})}
            />
            {!isEditing && (
              <p className="text-sm text-gray-400 mt-1">
                Upload a DOCX file. Chapters will be automatically detected and created.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Thumbnail Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setFiles({...files, thumbnail: e.target.files?.[0] || null})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {loading ? (
              isEditing ? 'Updating...' : 'Processing DOCX & Creating Chapters...'
            ) : (
              isEditing ? 'Update Story' : 'Upload & Process Story'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}