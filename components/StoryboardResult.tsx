import React from 'react';
import { Storyboard } from '../types/storyboard';

interface StoryboardResultProps {
  storyboard: Storyboard;
  onReset: () => void;
}

const StoryboardResult: React.FC<StoryboardResultProps> = ({ storyboard, onReset }) => {
  const downloadJSON = () => {
    const dataStr = JSON.stringify(storyboard, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${storyboard.wholeTitle}_storyboard.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">생성된 스토리보드</h2>
        <div className="space-x-4">
          <button
            onClick={downloadJSON}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            JSON 다운로드
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            새로 만들기
          </button>
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{storyboard.wholeTitle}</h3>
        <p className="text-gray-700 mb-4">{storyboard.storyTopic}</p>
        <div className="flex flex-wrap gap-2">
          {storyboard.hashtags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 페이지별 스토리보드 */}
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">페이지별 스토리보드</h3>
        {storyboard.pages.map((page, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-medium mr-3">
                {page.page}
              </span>
              <h4 className="text-lg font-semibold text-gray-800">페이지 {page.page}</h4>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">등장인물</h5>
                  <div className="flex flex-wrap gap-2">
                    {page.character.map((char, charIndex) => (
                      <span
                        key={charIndex}
                        className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm"
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-700 mb-2">배경</h5>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">
                    {page.background}
                  </p>
                </div>

                <div>
                  <h5 className="font-medium text-gray-700 mb-2">표정/포즈</h5>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">
                    {page.expressionPose}
                  </p>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-gray-700 mb-2">대사</h5>
                <div className="space-y-2">
                  {Object.entries(page.dialogue).map(([character, dialogue], dialogueIndex) => (
                    <div key={dialogueIndex} className="p-3 bg-yellow-50 rounded border-l-4 border-yellow-400">
                      <div className="font-medium text-gray-800 text-sm mb-1">{character}</div>
                      <div className="text-gray-700 text-sm">"{dialogue}"</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* JSON 미리보기 */}
      <div className="mt-8">
        <details className="border border-gray-200 rounded-lg">
          <summary className="p-4 bg-gray-50 cursor-pointer font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            JSON 형식으로 보기
          </summary>
          <pre className="p-4 bg-gray-900 text-green-400 text-sm overflow-x-auto">
            {JSON.stringify(storyboard, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default StoryboardResult; 