import React, { useState } from 'react';
import { FormInput } from '../types/storyboard';

interface StoryboardFormProps {
  onSubmit: (data: FormInput) => void;
  loading: boolean;
}

const StoryboardForm: React.FC<StoryboardFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<FormInput>({
    characters: '',
    keywords: '',
    plot: '',
    pageCount: 6,
  });

  const [errors, setErrors] = useState<Partial<FormInput>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'pageCount' ? parseInt(value) || 0 : value,
    }));
    
    // 에러 제거
    if (errors[name as keyof FormInput]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormInput> = {};

    if (!formData.plot.trim()) {
      newErrors.plot = '줄거리를 입력해주세요.';
    }

    if (!formData.pageCount || formData.pageCount < 1 || formData.pageCount > 10) {
      newErrors.pageCount = 1;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6">
      <div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
          스토리 입력
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          창의적인 스토리보드를 위한 정보를 입력해주세요
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="characters" className="block text-sm font-bold text-gray-700 mb-2">
            등장인물
          </label>
          <input
            type="text"
            id="characters"
            name="characters"
            value={formData.characters}
            onChange={handleChange}
            placeholder="이름, 역할 등 간단히 입력해주세요."
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all shadow-sm text-sm placeholder-gray-400"
          />
        </div>

        <div>
          <label htmlFor="keywords" className="block text-sm font-bold text-gray-700 mb-2">
            필수 키워드 및 주제
          </label>
          <input
            type="text"
            id="keywords"
            name="keywords"
            value={formData.keywords}
            onChange={handleChange}
            placeholder="꼭 들어가야하는 키워드나 주제가 있다면 입력해주세요."
            className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all shadow-sm text-sm placeholder-gray-400"
          />
        </div>

        <div>
          <label htmlFor="plot" className="block text-sm font-bold text-gray-700 mb-2">
            줄거리 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="plot"
            name="plot"
            rows={5}
            value={formData.plot}
            onChange={handleChange}
            placeholder="인스타툰을 만들기 위한 줄거리를 입력해 주세요."
            className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all shadow-sm resize-none text-sm placeholder-gray-400 ${
              errors.plot ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200'
            }`}
          />
          {errors.plot && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.plot}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="pageCount" className="block text-sm font-bold text-gray-700 mb-2">
            분량 <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="pageCount"
            name="pageCount"
            min="1"
            max="10"
            value={formData.pageCount}
            onChange={handleChange}
            placeholder="보통 4~8페이지를 권장합니다."
            className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all shadow-sm text-sm placeholder-gray-400 ${
              errors.pageCount ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200'
            }`}
          />
          {errors.pageCount && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              1-10 페이지 사이로 입력해주세요.
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">보통 4~8페이지를 권장합니다.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 px-6 rounded-2xl font-bold text-white transition-all shadow-lg text-base ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 transform hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              스토리보드 생성하기...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              스토리보드 생성하기
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

export default StoryboardForm; 