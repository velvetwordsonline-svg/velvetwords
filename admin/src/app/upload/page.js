'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminNav from '@/components/AdminNav';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function UploadPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: 'everyday-chemistry',
  });

  const categories = [
    { id: 'everyday-chemistry', name: 'Everyday Chemistry' },
    { id: 'slow-emotional', name: 'Slow & Emotional' },
    { id: 'city-travel', name: 'City Travel & Temporary Love' },
    { id: 'forbidden-risky', name: 'Forbidden & Risky Desire' },
    { id: 'midnight-confession', name: 'Midnight & Confession' },
    { id: 'power-elite', name: 'Power Identity & Elite Lives' },
  ];

  const subCategories = [
    'Office Chemistry',
    'One Last Goodbye',
    'Age Gap Romance',
    'City Love Story',
    'Mind Games & Attraction',
    'Secret Affair',
    'Artistic Souls',
    'Unspoken Desire',
    'Slow Burn Romance',
    'Travel & Temporary Love',
    'Forbidden Desire',
    'Therapist–Client Tension',
    'Rivalry',
    'Identity & Desire',
    'Forbidden Attraction',
    'Midnight Encounters',
    'Second Chance Love',
    'Midnight Confessions',
    'Royal & Elite Lives',
  ];
  const [thumbnail, setThumbnail] = useState(null);
  const [document, setDocument] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { getRootProps: getThumbProps, getInputProps: getThumbInput } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    onDrop: (files) => setThumbnail(files[0]),
  });

  const { getRootProps: getDocProps, getInputProps: getDocInput } = useDropzone({
    accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1,
    onDrop: (files) => setDocument(files[0]),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!thumbnail || !document) {
      toast.error('Please upload both thumbnail and document');
      return;
    }

    setUploading(true);
    const data = new FormData();
    data.append('thumbnail', thumbnail);
    data.append('document', document);
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      await adminAPI.uploadStory(data, setProgress);
      toast.success('Story uploaded successfully!');
      router.push('/stories');
    } catch (error) {
      console.error('Upload error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Upload failed';
      toast.error(errorMsg);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload New Story</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Story Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter story title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
              <select
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select subcategory</option>
                {subCategories.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Enter story description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image</label>
              <div {...getThumbProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition">
                <input {...getThumbInput()} />
                {thumbnail ? (
                  <div>
                    <img src={URL.createObjectURL(thumbnail)} alt="Preview" className="max-h-40 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">{thumbnail.name}</p>
                  </div>
                ) : (
                  <p className="text-gray-600">Drag & drop thumbnail or click to browse</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Story Document (DOCX)</label>
              <div {...getDocProps()} className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition">
                <input {...getDocInput()} />
                {document ? (
                  <p className="text-sm text-gray-600">📄 {document.name}</p>
                ) : (
                  <p className="text-gray-600">Drag & drop DOCX file or click to browse</p>
                )}
              </div>
            </div>

            {uploading && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between text-sm text-gray-700 mb-2">
                  <span>Uploading and translating...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {uploading ? 'Uploading...' : 'Upload Story'}
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
