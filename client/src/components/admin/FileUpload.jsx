import { useState } from 'react';
import { Upload, FileText, ExternalLink } from 'lucide-react';
import { uploadDocument } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';

/* Uploads a PDF to the server (not a third-party host) and stores the URL.
   Shows the current file link + a manual URL fallback. */
export default function FileUpload({ value, onChange, accept = 'application/pdf' }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const { url } = await uploadDocument(file);
      onChange(url);
      toast.success('File uploaded');
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
          <Upload className="h-4 w-4" /> {busy ? 'Uploading…' : 'Upload PDF'}
          <input type="file" accept={accept} className="hidden" onChange={handleFile} disabled={busy} />
        </label>
        <input className="input flex-1" placeholder="…or paste a file URL" value={value || ''} onChange={(e) => onChange(e.target.value)} />
      </div>
      {value && (
        <a href={value} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-xs text-accent hover:text-accent-soft">
          <FileText className="h-3.5 w-3.5" /> View current file <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </div>
  );
}
