import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
};

const FILE_TYPE_LABELS = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'image/png': 'PNG',
  'image/jpeg': 'JPG/JPEG',
};

export default function FileUpload({ onFileSelect, selectedFile }) {
  const [dragError, setDragError] = useState('');

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setDragError('');
    if (rejectedFiles.length > 0) {
      const reason = rejectedFiles[0].errors[0];
      if (reason.code === 'file-too-large') setDragError('File exceeds 10MB limit.');
      else if (reason.code === 'file-invalid-type') setDragError('Invalid file type. Use PDF, DOCX, PNG, or JPG.');
      else setDragError(reason.message);
      return;
    }
    if (acceptedFiles.length > 0) onFileSelect(acceptedFiles[0]);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const borderColor = isDragReject || dragError
    ? 'border-rose-500/70 bg-rose-500/5'
    : isDragActive
    ? 'border-[#c4893a] bg-[#c4893a]/10 scale-[1.01]'
    : selectedFile
    ? 'border-emerald-500/60 bg-emerald-500/5'
    : 'border-white/20 hover:border-[#c4893a]/60 hover:bg-[#c4893a]/5';

  return (
    <div>
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-200 ${borderColor}`}
      >
        <input {...getInputProps()} />

        {selectedFile ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{selectedFile.name}</p>
              <p className="text-slate-400 text-sm mt-0.5">
                {FILE_TYPE_LABELS[selectedFile.type]} · {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <span className="text-xs text-slate-500 flex-shrink-0">Click to replace</span>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl border border-white/10 flex items-center justify-center mb-4" style={{ background: 'rgba(196,137,58,0.1)' }}>
              {isDragActive ? (
                <svg className="w-7 h-7 animate-bounce" style={{ color: '#c4893a' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              ) : (
                <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
            </div>
            <p className="text-white font-medium mb-1">
              {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
            </p>
            <p className="text-slate-500 text-sm">Drag & drop or click to browse</p>
            <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
              {['PDF', 'DOCX', 'PNG', 'JPG'].map((t) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">{t}</span>
              ))}
              <span className="text-xs text-slate-600">· max 10MB</span>
            </div>
          </div>
        )}
      </div>
      {dragError && (
        <p className="mt-2 text-sm text-rose-400 flex items-center gap-1.5">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {dragError}
        </p>
      )}
    </div>
  );
}
