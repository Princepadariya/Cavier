import React, { useRef, useState } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { uploadImage } from '../../lib/api';

/**
 * Single image upload. Shows a preview, uploads to Supabase storage on select,
 * and calls onChange(url).
 */
export function ImageUpload({ value, onChange, folder = 'misc', label, aspect = 'aspect-video' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file) => {
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label && <span className="mb-1.5 block text-sm font-medium text-neutral-700">{label}</span>}
      <div
        className={`group relative ${aspect} w-full overflow-hidden rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-50 transition-colors hover:border-neutral-400`}
      >
        {value ? (
          <>
            <img src={value} alt="" className="h-full w-full object-contain" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-neutral-400"
          >
            {uploading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <>
                <UploadCloud size={22} />
                <span className="text-xs">Click to upload</span>
              </>
            )}
          </button>
        )}
        {value && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-neutral-700 opacity-0 shadow transition-opacity group-hover:opacity-100"
          >
            Replace
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </div>
  );
}

/**
 * Multi-image gallery upload. value is string[] of URLs.
 */
export function GalleryUpload({ value = [], onChange, folder = 'misc', label }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = async (files) => {
    if (!files?.length) return;
    setError('');
    setUploading(true);
    try {
      const urls = [];
      for (const file of files) urls.push(await uploadImage(file, folder));
      onChange([...value, ...urls]);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (i) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div>
      {label && <span className="mb-1.5 block text-sm font-medium text-neutral-700">{label}</span>}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((url, i) => (
          <div
            key={i}
            className="group relative aspect-square overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50"
          >
            <img src={url} alt="" className="h-full w-full object-contain" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-neutral-300 text-neutral-400 transition-colors hover:border-neutral-400"
        >
          {uploading ? <Loader2 size={20} className="animate-spin" /> : <UploadCloud size={20} />}
          <span className="text-[10px]">Add</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(Array.from(e.target.files || []))}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </div>
  );
}
