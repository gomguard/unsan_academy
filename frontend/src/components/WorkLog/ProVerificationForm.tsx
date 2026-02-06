import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, X, Check, Image as ImageIcon, FileText } from 'lucide-react';

interface ProVerificationFormProps {
  onSubmit: (verification: {
    beforeImage: string;
    afterImage: string;
    description: string;
    taskType: string;
  }) => void;
}

const verificationTypes = [
  { id: 'brake_service', label: '브레이크 오버홀', statBoost: 'Tech +2' },
  { id: 'suspension', label: '서스펜션 교체', statBoost: 'Hand +2' },
  { id: 'engine_diag', label: '엔진 진단', statBoost: 'Tech +3' },
  { id: 'ev_battery', label: 'EV 배터리 점검', statBoost: 'Tech +4' },
  { id: 'ppf_install', label: 'PPF 시공', statBoost: 'Art +3' },
  { id: 'detailing', label: '프리미엄 디테일링', statBoost: 'Art +2' },
];

export function ProVerificationForm({ onSubmit }: ProVerificationFormProps) {
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'before') {
          setBeforeImage(result);
        } else {
          setAfterImage(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!beforeImage || !afterImage || !description || !selectedType) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    onSubmit({
      beforeImage,
      afterImage,
      description,
      taskType: selectedType,
    });

    setIsSubmitting(false);
    setShowSuccess(true);
    setBeforeImage(null);
    setAfterImage(null);
    setDescription('');
    setSelectedType(null);

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const isValid = beforeImage && afterImage && description.length >= 10 && selectedType;
  const selectedTypeInfo = verificationTypes.find(t => t.id === selectedType);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
          <Camera className="w-4 h-4 text-purple-400" />
        </div>
        <div>
          <h3 className="font-bold text-white">Pro Verification</h3>
          <p className="text-xs text-slate-500">사진 인증으로 스탯 부스트</p>
        </div>
      </div>

      {/* Task Type Selection */}
      <div className="mb-4">
        <label className="block text-sm text-slate-400 mb-2">인증 유형</label>
        <div className="grid grid-cols-2 gap-2">
          {verificationTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                selectedType === type.id
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <p className={`text-sm font-medium ${selectedType === type.id ? 'text-purple-400' : 'text-white'}`}>
                {type.label}
              </p>
              <p className="text-xs text-green-400">{type.statBoost}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Image Upload */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Before Image */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">작업 전</label>
          <div
            onClick={() => beforeInputRef.current?.click()}
            className={`relative aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
              beforeImage
                ? 'border-purple-500/50 bg-purple-500/10'
                : 'border-slate-600 hover:border-slate-500'
            }`}
          >
            {beforeImage ? (
              <>
                <img
                  src={beforeImage}
                  alt="Before"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setBeforeImage(null);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </>
            ) : (
              <>
                <ImageIcon className="w-6 h-6 text-slate-500 mb-1" />
                <span className="text-xs text-slate-500">탭하여 업로드</span>
              </>
            )}
          </div>
          <input
            ref={beforeInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleImageSelect(e, 'before')}
          />
        </div>

        {/* After Image */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">작업 후</label>
          <div
            onClick={() => afterInputRef.current?.click()}
            className={`relative aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
              afterImage
                ? 'border-purple-500/50 bg-purple-500/10'
                : 'border-slate-600 hover:border-slate-500'
            }`}
          >
            {afterImage ? (
              <>
                <img
                  src={afterImage}
                  alt="After"
                  className="absolute inset-0 w-full h-full object-cover rounded-xl"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAfterImage(null);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </>
            ) : (
              <>
                <ImageIcon className="w-6 h-6 text-slate-500 mb-1" />
                <span className="text-xs text-slate-500">탭하여 업로드</span>
              </>
            )}
          </div>
          <input
            ref={afterInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleImageSelect(e, 'after')}
          />
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm text-slate-400 mb-2">
          작업 내용 <span className="text-slate-600">(최소 10자)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="수행한 작업을 상세히 기술해주세요..."
          rows={3}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white resize-none focus:border-purple-500 focus:outline-none transition-colors"
        />
        <p className="text-xs text-slate-500 mt-1 text-right">{description.length}/100</p>
      </div>

      {/* Reward Preview */}
      {selectedTypeInfo && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-sm font-bold">보상:</span>
            <span className="text-green-400 text-sm">{selectedTypeInfo.statBoost}</span>
            <span className="text-xs text-slate-500">+ "Verified" 뱃지</span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <motion.button
        onClick={handleSubmit}
        disabled={!isValid || isSubmitting}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
          isValid
            ? 'bg-purple-500 text-white hover:bg-purple-400'
            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
        }`}
      >
        {showSuccess ? (
          <>
            <Check className="w-5 h-5" />
            인증 제출 완료!
          </>
        ) : isSubmitting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Upload className="w-5 h-5" />
            </motion.div>
            업로드 중...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            인증 제출
          </>
        )}
      </motion.button>
    </div>
  );
}
