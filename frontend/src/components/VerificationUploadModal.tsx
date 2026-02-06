import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Camera, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import type { SalaryReport } from '@/types';

interface VerificationUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  report?: SalaryReport;
  currentSalary?: number;
  onUpload: (file: File) => Promise<void>;
}

export function VerificationUploadModal({
  isOpen,
  onClose,
  report,
  currentSalary,
  onUpload,
}: VerificationUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      await onUpload(selectedFile);
      onClose();
    } catch {
      // Handle error
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    onClose();
  };

  // Use report salary if available, otherwise use currentSalary prop
  const displaySalary = report?.current_salary ?? currentSalary;
  const displayTitle = report?.target_job_title;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                연봉 인증하기
              </h3>
              <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Salary Summary */}
              {displaySalary && (
                <div className="p-3 bg-gray-50 rounded-lg mb-4 border border-gray-200">
                  {displayTitle && <p className="text-gray-500 text-sm mb-1">{displayTitle}</p>}
                  <p className="text-gray-900 font-bold">
                    연봉 {displaySalary.toLocaleString()}만원
                  </p>
                </div>
              )}

              {/* Instructions */}
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-amber-700 mb-1">인증 가이드</p>
                    <ul className="space-y-1 text-gray-600">
                      <li>급여명세서 또는 원천징수영수증 사진</li>
                      <li>개인정보(주민번호 등)는 가려주세요</li>
                      <li>연봉 금액이 선명하게 보여야 합니다</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Upload Area */}
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div
                  className={`
                    border-2 border-dashed rounded-xl p-6 text-center transition-colors
                    ${
                      preview
                        ? 'border-green-400 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                    }
                  `}
                >
                  {preview ? (
                    <div className="space-y-2">
                      <img
                        src={preview}
                        alt="Preview"
                        className="max-h-40 mx-auto rounded-lg object-contain"
                      />
                      <p className="text-green-600 text-sm font-medium flex items-center justify-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {selectedFile?.name}
                      </p>
                      <p className="text-gray-500 text-xs">클릭하여 다시 선택</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Camera className="w-10 h-10 text-gray-400 mx-auto" />
                      <p className="text-gray-600">사진을 선택하세요</p>
                      <p className="text-gray-400 text-xs">JPG, PNG (최대 10MB)</p>
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="w-full py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    업로드 중...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    인증 요청하기
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
