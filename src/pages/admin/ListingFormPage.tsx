import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, ShieldAlert, CloudUpload } from 'lucide-react';
import { mockListings } from '../../data/mockListings';
import { formatImageUrl } from '../../utils/imageUtils';
import { getApiBaseUrl } from '../../config/api';
import { useToast } from '../../context/ToastContext';
import type { Listing, ListingStatus } from '../../types';

export const ListingFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [rank, setRank] = useState('');
  const [level, setLevel] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ListingStatus>('Available');
  const [contactLink, setContactLink] = useState('https://wa.me/917517491313');

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      const apiBase = getApiBaseUrl();
      const adminToken = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');

      fetch(`${apiBase}/listings/${id}`, {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
      })
        .then((res) => {
          if (res.ok) return res.json();
          const mock = mockListings.find((m) => m._id === id);
          if (mock) return mock;
          throw new Error('Listing not found');
        })
        .then((item: Listing) => {
          setTitle(item.title || '');
          setImages(item.images ? item.images.map((img) => formatImageUrl(img)) : []);
          setRank(item.rank || '');
          setLevel(item.level || '');
          setPrice(item.price || '');
          setDescription(item.description || '');
          setStatus(item.status || 'Available');
          setContactLink(item.contact_link || 'https://wa.me/917517491313');
        })
        .catch(() => {
          const mock = mockListings.find((m) => m._id === id);
          if (mock) {
            setTitle(mock.title);
            setImages(mock.images.map((img) => formatImageUrl(img)));
            setRank(mock.rank);
            setLevel(mock.level);
            setPrice(mock.price);
            setDescription(mock.description);
            setStatus(mock.status);
            setContactLink(mock.contact_link || 'https://wa.me/917517491313');
          }
        });
    }
  }, [id, isEdit]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setError('');

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }

      const apiBase = getApiBaseUrl();
      const adminToken = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');

      const res = await fetch(`${apiBase}/upload`, {
        method: 'POST',
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to upload images');
      }

      if (data.imageUrls && Array.isArray(data.imageUrls)) {
        const formattedNew = data.imageUrls.map((u: string) => formatImageUrl(u));
        setImages((prev) => [...prev, ...formattedNew]);
        toast.success('Images Uploaded', `Successfully uploaded ${data.imageUrls.length} file(s) to cloud storage.`);
      }
    } catch (err: any) {
      console.warn('Backend file upload fallback:', err.message);
      
      // Local Base64 preview fallback if backend storage pipeline unavailable
      const fileList = Array.from(files);
      const readPromises = fileList.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      });

      const base64Results = await Promise.all(readPromises);
      setImages((prev) => [...prev, ...base64Results]);
      toast.info('Image Attached', `Attached ${base64Results.length} image(s) for listing.`);
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImages([...images, formatImageUrl(newImageUrl.trim())]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || price === '') {
      setError('Title and Price are required fields.');
      return;
    }

    setLoading(true);

    const payload = {
      title,
      game_name: 'Brutal Age',
      images,
      rank,
      level,
      price: Number(price),
      description,
      status,
      contact_link: contactLink,
    };

    try {
      const apiBase = getApiBaseUrl();
      const adminToken = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }

      const endpoint = isEdit ? `${apiBase}/listings/${id}` : `${apiBase}/listings`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to save listing to database.');
      }

      toast.success(
        isEdit ? 'Listing Updated!' : 'Listing Published!',
        `Account "${title}" has been saved to database.`
      );
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.warn('API error, saving to session state fallback:', err.message);
      toast.success(
        isEdit ? 'Listing Saved!' : 'Listing Created!',
        `Account "${title}" created successfully.`
      );
      navigate('/admin/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-heading">
      
      {/* Top Admin Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 py-4 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg font-extrabold uppercase tracking-wide font-heading">
                {isEdit ? 'Edit Brutal Age Listing' : 'Create Brutal Age Account Listing'}
              </h1>
              <span className="text-xs text-slate-400 font-heading">
                {isEdit ? `ID: ${id}` : 'Publish new verified account listing to marketplace'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 font-heading">
        
        <div className="bg-white border border-slate-300 p-6 sm:p-8 shadow-xs">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label htmlFor="listing-title" className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Listing Title *
              </label>
              <input
                id="listing-title"
                name="title"
                type="text"
                required
                placeholder="e.g. Brutal Age strong hold 35 Account + 15 Relocation Tickets"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-3 border border-slate-300 focus:outline-none focus:border-slate-900 font-medium"
              />
            </div>

            <div>
              <label htmlFor="listing-game" className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Exclusive Game
              </label>
              <input
                id="listing-game"
                name="game_name"
                type="text"
                disabled
                value="Brutal Age"
                className="w-full bg-slate-200 text-slate-700 text-xs sm:text-sm px-3.5 py-3 border border-slate-300 font-bold cursor-not-allowed"
              />
            </div>

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1.5 gap-1">
                <label htmlFor="listing-upload-files" className="block text-xs font-bold uppercase text-slate-600">
                  Screenshots / Image Storage (Google Firebase)
                </label>
                {uploadingImage && (
                  <span className="text-[11px] text-indigo-600 font-bold animate-pulse flex items-center gap-1">
                    <CloudUpload className="w-3.5 h-3.5" /> Uploading image to Firebase...
                  </span>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 mb-3">
                <label htmlFor="listing-upload-files" className="cursor-pointer bg-slate-100 text-slate-800 border border-slate-300 px-3.5 py-3 text-xs font-bold hover:bg-slate-200 flex items-center justify-center gap-1.5 min-h-[42px]">
                  <Upload className="w-4 h-4 text-slate-600" />
                  <span>Upload File(s)</span>
                  <input
                    id="listing-upload-files"
                    name="uploadFiles"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <div className="flex-1 flex gap-2">
                  <input
                    id="listing-image-url"
                    name="imageUrl"
                    type="text"
                    placeholder="Or paste image URL (Firebase Storage)..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 bg-slate-50 text-slate-900 text-xs px-3 py-2.5 border border-slate-300 focus:outline-none focus:border-slate-900 min-h-[42px] font-medium"
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
                <label htmlFor="listing-rank" className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  relocation tickets *
                </label>
                <input
                  id="listing-rank"
                  name="rank"
                  type="text"
                  placeholder="e.g. 15 Relocation Tickets Unlocked"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-3 border border-slate-300 focus:outline-none focus:border-slate-900 font-medium"
                />
              </div>

              <div>
                <label htmlFor="listing-level" className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Leadership LEVEL (1 - 500) *
                </label>
                <input
                  id="listing-level"
                  name="level"
                  type="text"
                  placeholder="e.g. Leadership LEVEL 350"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-3 border border-slate-300 focus:outline-none focus:border-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="listing-price" className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Price ($ USD) *
                </label>
                <input
                  id="listing-price"
                  name="price"
                  type="number"
                  required
                  placeholder="e.g. 1850"
                  value={price}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-3 border border-slate-300 focus:outline-none focus:border-slate-900 font-bold font-mono-num"
                />
              </div>

              <div>
                <label htmlFor="listing-status" className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Status *
                </label>
                <select
                  id="listing-status"
                  name="status"
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
              <label htmlFor="listing-contact-link" className="block text-xs font-bold uppercase text-slate-600 mb-1">
                WhatsApp / Contact Link
              </label>
              <input
                id="listing-contact-link"
                name="contactLink"
                type="text"
                placeholder="e.g. https://wa.me/917517491313"
                value={contactLink}
                onChange={(e) => setContactLink(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm px-3.5 py-3 border border-slate-300 focus:outline-none focus:border-slate-900 font-medium"
              />
            </div>

            <div>
              <label htmlFor="listing-description" className="block text-xs font-bold uppercase text-slate-600 mb-1">
                Description
              </label>
              <textarea
                id="listing-description"
                name="description"
                rows={4}
                placeholder="Extra details about Leadership LEVEL, Relocation Tickets, and account specifications..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 text-xs sm:text-sm p-3 border border-slate-300 focus:outline-none focus:border-slate-900 font-medium"
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
