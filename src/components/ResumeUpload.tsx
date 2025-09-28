import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, User, Mail, Phone } from 'lucide-react';
import { parseResume, ExtractedData } from '../utils/resumeParser';

interface ResumeUploadProps {
  onDataExtracted: (data: ExtractedData & { file: File }) => void;
}

export function ResumeUpload({ onDataExtracted }: ResumeUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file.type.includes('pdf') && !file.type.includes('document')) {
      setError('Please upload a PDF or DOCX file.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const data = await parseResume(file);
      setExtractedData(data);
      onDataExtracted({ ...data, file });
    } catch (err) {
      setError('Failed to parse resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
          dragOver
            ? 'border-blue-400 bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            ) : (
              <Upload className="w-8 h-8 text-white" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Upload Your Resume
          </h3>
          <p className="text-gray-600 mb-4">
            Drag and drop your resume or click to browse
          </p>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileInput}
            className="hidden"
            id="resume-upload"
            disabled={uploading}
          />
          <label
            htmlFor="resume-upload"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 cursor-pointer transform hover:scale-105"
          >
            <FileText className="w-4 h-4 mr-2" />
            Choose File
          </label>
        </div>
      </div>

      {error && (
        <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {extractedData && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center mb-3">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <h4 className="text-lg font-medium text-green-800">Data Extracted Successfully</h4>
          </div>
          <div className="space-y-2">
            {extractedData.name && (
              <div className="flex items-center">
                <User className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-green-700">Name: {extractedData.name}</span>
              </div>
            )}
            {extractedData.email && (
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-green-700">Email: {extractedData.email}</span>
              </div>
            )}
            {extractedData.phone && (
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-green-700">Phone: {extractedData.phone}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}