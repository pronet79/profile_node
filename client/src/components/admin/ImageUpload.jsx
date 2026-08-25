import { useState } from 'react';
import { Upload } from 'lucide-react';
import { uploadImage } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

/* Reusable image upload with preview + manual URL fallback.
   Uploads via the admin /uploads endpoint (Cloudinary or local disk). */
export default function ImageUpload({ value, onChange, previewClass = 'h-24' }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const { url } = await uploadImage(file);
      onChange(url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <label className="btn-ghost h-9 cursor-pointer !px-3 text-xs">
          <Upload className="h-4 w-4" /> {busy ? 'Uploading…' : 'Upload'}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={busy} />
        </label>
        <input className="input flex-1" placeholder="…or paste an image URL" value={value || ''} onChange={(e) => onChange(e.target.value)} />
      </div>
      {value && <img src={value} alt="preview" className={`mt-3 ${previewClass} rounded-lg border border-white/10 object-cover`} />}
    </div>
  );
}
