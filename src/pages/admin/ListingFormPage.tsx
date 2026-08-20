import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Upload, X, Save, CloudUpload } from 'lucide-react';
import type { ListingStatus } from '../../types';
import { getApiBaseUrl } from '../../config/api';

export const ListingFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const [title, setTitle] = useState('');
  const [rank, setRank] = useState(''); // Stores relocation tickets
  const [level, setLevel] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ListingStatus>('Available');
  const [contactLink, setContactLink] = useState('https://wa.me/919876543210');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    if (isEdit && id) {
      const apiBase = getApiBaseUrl();
      fetch(`${apiBase}/listings/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.title) {
            setTitle(data.title);
            setRank(data.rank || '');
            setLevel(data.level || '');
            setPrice(data.price || '');
            setDescription(data.description || '');
            setStatus(data.status || 'Available');
            setContactLink(data.contact_link || '');
            setImages(data.images || []);
          }
        })
        .catch(() => {});
    }
  }, [id, isEdit, token, navigate]);

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('images', file);
    });

    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.imageUrls && Array.isArray(data.imageUrls)) {
          setImages((prev) => [...prev, ...data.imageUrls]);
        }
      } else {
        // Fallback local FileReader Base64 read with client compression
        Array.from(files).forEach((file) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setImages((prev) => [...prev, event.target!.result as string]);
            }
          };
          reader.readAsDataURL(file);
        });
      }
    } catch (err) {
      // Base64 fallback if server API is offline
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImages((prev) => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload = {
      title,
      game_name: 'Brutal Age',
      rank, // Relocation tickets info
      level,
      resources: '',
      login_details_note: '',
      price: Number(price),
      description,
      status,
      contact_link: contactLink,
      images,
    };

    try {
      const apiBase = getApiBaseUrl();
      const url = isEdit
        ? `${apiBase}/listings/${id}`
        : `${apiBase}/listings`;

      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get('content-type');
      let data: any = {};

      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        if (res.status === 413) {
          throw new Error('Image files are too large (exceeds 50MB limit). Please upload smaller images or paste image URLs.');
        }
        throw new Error(`Server error HTTP ${res.status}.`);
      }

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save account listing to server.');
      }

      setMessage({
        type: 'success',
        text: `Listing successfully ${isEdit ? 'updated' : 'published'}! Redirecting to Console...`,
      });
      setTimeout(() => navigate('/admin/dashboard'), 1000);
    } catch (err: any) {
      console.error('Save listing error:', err);
      setMessage({
        type: 'error',
        text: err.message || 'An error occurred while publishing the listing.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-4 sm:py-8 px-3 sm:px-6 lg:px-8 text-slate-900 font-heading">
      <div className="max-w-3xl mx-auto space-y-4">
        
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/admin/dashboard"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-300 bg-white px-3 py-2 flex items-center gap-1 min-h-[38px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Console</span>
          </Link>
          <span className="text-[11px] text-slate-500 font-bold">
            Brutal Age Listing Form
          </span>
        </div>

        <div className="bg-white p-4 sm:p-8 border border-slate-300 shadow-md">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading mb-5 border-b border-slate-200 pb-3">
            {isEdit ? 'Edit Brutal Age Listing' : 'Add New Brutal Age Listing'}
          </h2>

          {message && (
            <div
              className={`mb-5 p-3.5 border text-xs font-bold ${
                message.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-red-50 border-red-300 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Listing Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Brutal Age strong hold 35 Account + 15 Relocation Tickets"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-3 border border-slate-300 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Exclusive Game
              </label>
              <input
                type="text"
                disabled
                value="Brutal Age"
                className="w-full bg-slate-200 text-slate-700 text-xs sm:text-sm px-3.5 py-3 border border-slate-300 font-bold cursor-not-allowed"
              />
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1.5 gap-1">
                <label className="block text-xs font-bold uppercase text-slate-600">
                  Screenshots / Image Storage (Google Firebase)
                </label>
                {uploadingImage && (
                  <span className="text-[11px] text-indigo-600 font-bold animate-pulse flex items-center gap-1">
                    <CloudUpload className="w-3.5 h-3.5" /> Uploading image to Firebase...
                  </span>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <label className="cursor-pointer bg-slate-100 text-slate-800 border border-slate-300 px-3.5 py-3 text-xs font-bold hover:bg-slate-200 flex items-center justify-center gap-1.5 min-h-[42px]">
                  <Upload className="w-4 h-4 text-slate-600" />
                  <span>Upload File(s)</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    placeholder="Or paste image URL (Firebase Storage)..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 bg-slate-50 text-slate-900 text-xs px-3 py-2.5 border border-slate-300 focus:outline-none focus:border-slate-900 min-h-[42px]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3.5 py-2.5 bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 min-h-[42px]"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2 bg-slate-50 border border-slate-300">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-video bg-white border border-slate-300 overflow-hidden">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-0 right-0 p-1 bg-slate-900 text-white text-[10px] font-bold"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  relocation tickets *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15 Relocation Tickets Unlocked"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-3 border border-slate-300 focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Leadership LEVEL (1 - 500) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Leadership LEVEL 350"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-3 border border-slate-300 focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Price ($ USD) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 1850"
                  value={price}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-3 border border-slate-300 focus:outline-none focus:border-slate-900 font-bold font-mono-num"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Status *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ListingStatus)}
                  className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-3 border border-slate-300 focus:outline-none focus:border-slate-900 font-bold"
                >
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                WhatsApp / Contact Link
              </label>
              <input
                type="text"
                placeholder="e.g. https://wa.me/919876543210"
                value={contactLink}
                onChange={(e) => setContactLink(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-3 border border-slate-300 focus:outline-none focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Extra details about Leadership LEVEL, Relocation Tickets, and account specifications..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm p-3 border border-slate-300 focus:outline-none focus:border-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-indigo w-full py-4 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs min-h-[46px]"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Listing...' : isEdit ? 'Update Brutal Age Listing' : 'Publish Brutal Age Listing'}</span>
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};
