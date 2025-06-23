import React, { useState } from 'react';
import Head from 'next/head';
import { Document, Paragraph, TextRun, HeadingLevel, Packer } from 'docx';
import { saveAs } from 'file-saver';
import StoryboardForm from '../components/StoryboardForm';
import StoryboardResult from '../components/StoryboardResult';
import { FormInput, Storyboard, ApiResponse } from '../types/storyboard';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [storyboard, setStoryboard] = useState<Storyboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('');

  const handleSubmit = async (formData: FormInput) => {
    setLoading(true);
    setError(null);
    setLoadingStep('AI가 스토리를 분석하고 있습니다...');

    try {
      const response = await fetch('/api/generate-storyboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      setLoadingStep('스토리보드를 생성하고 있습니다...');

      const result: ApiResponse = await response.json();

      if (result.success && result.data) {
        setLoadingStep('생성 완료!');
        setTimeout(() => {
          setStoryboard(result.data!);
          setLoadingStep('');
        }, 500);
      } else {
        setError(result.error || '알 수 없는 오류가 발생했습니다.');
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다. 다시 시도해주세요.');
      console.error('API 호출 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStoryboard(null);
    setError(null);
  };

  const generateDocx = async () => {
    if (!storyboard) return;

    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // 제목
            new Paragraph({
              children: [
                new TextRun({
                  text: storyboard.wholeTitle,
                  bold: true,
                  size: 32,
                  color: "4F46E5"
                })
              ],
              heading: HeadingLevel.TITLE,
              spacing: { after: 400 }
            }),

            // 주제 설명
            new Paragraph({
              children: [
                new TextRun({
                  text: "스토리 주제",
                  bold: true,
                  size: 24
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: storyboard.storyTopic,
                  size: 22
                })
              ],
              spacing: { after: 400 }
            }),

            // 해시태그
            new Paragraph({
              children: [
                new TextRun({
                  text: "해시태그",
                  bold: true,
                  size: 24
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: storyboard.hashtags.map(tag => `#${tag}`).join(' '),
                  size: 22,
                  color: "7C3AED"
                })
              ],
              spacing: { after: 600 }
            }),

            // 페이지별 스토리보드
            new Paragraph({
              children: [
                new TextRun({
                  text: "페이지별 스토리보드",
                  bold: true,
                  size: 28
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 600, after: 400 }
            }),

            // 각 페이지
            ...storyboard.pages.flatMap(page => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `페이지 ${page.page}`,
                    bold: true,
                    size: 24,
                    color: "4F46E5"
                  })
                ],
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 }
              }),

              // 등장인물
              new Paragraph({
                children: [
                  new TextRun({
                    text: "등장인물: ",
                    bold: true,
                    size: 20
                  }),
                  new TextRun({
                    text: page.character.join(', '),
                    size: 20
                  })
                ],
                spacing: { after: 200 }
              }),

              // 배경
              new Paragraph({
                children: [
                  new TextRun({
                    text: "배경: ",
                    bold: true,
                    size: 20
                  }),
                  new TextRun({
                    text: page.background,
                    size: 20
                  })
                ],
                spacing: { after: 200 }
              }),

              // 대사
              new Paragraph({
                children: [
                  new TextRun({
                    text: "대사",
                    bold: true,
                    size: 20
                  })
                ],
                spacing: { after: 100 }
              }),
              ...Object.entries(page.dialogue).map(([character, dialogue]) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${character}: `,
                      bold: true,
                      size: 18
                    }),
                    new TextRun({
                      text: `"${dialogue}"`,
                      size: 18,
                      italics: true
                    })
                  ],
                  spacing: { after: 100 }
                })
              ),

              // 표정/포즈
              new Paragraph({
                children: [
                  new TextRun({
                    text: "표정/포즈: ",
                    bold: true,
                    size: 20
                  }),
                  new TextRun({
                    text: page.expressionPose,
                    size: 20
                  })
                ],
                spacing: { after: 400 }
              })
            ])
          ]
        }]
      });

      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      saveAs(blob, `${storyboard.wholeTitle}_스토리보드.docx`);
    } catch (err) {
      console.error('DOCX 생성 오류:', err);
      alert('DOCX 파일 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <Head>
        <title>인스타툰 스토리보드 생성기</title>
        <meta name="description" content="AI를 활용한 인스타툰 스토리보드 자동 생성 시스템" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-300 to-indigo-300 p-4">
        {/* 로딩 모달 */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md mx-4">
              <div className="text-center">
                <div className="mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                  스토리보드 생성 중
                </h3>
                <p className="text-gray-600 text-lg font-medium mb-4">
                  {loadingStep}
                </p>
                <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <p className="text-purple-700 text-sm mt-2 font-medium">
                    잠시만 기다려주세요...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 헤더 */}
        <div className="max-w-6xl mx-auto text-center mb-6 py-6">
          <div className="flex items-center justify-center mb-3">
            <div className="bg-gradient-to-r from-purple-400 to-indigo-400 p-3 rounded-2xl mr-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              인스타툰 스토리보드 생성기
            </h1>
          </div>
          <p className="text-lg text-gray-600 font-medium">
            GPT-4.1로 창의적인 인스타툰 스토리보드를 만들어보세요
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="max-w-6xl mx-auto mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* 메인 콘텐츠 - 좌우 분할 */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-6">
            {/* 왼쪽 입력 영역 (2/5) */}
            <div className="lg:col-span-2">
              <div className="sticky top-6">
                <StoryboardForm onSubmit={handleSubmit} loading={loading} />
              </div>
            </div>

            {/* 오른쪽 결과 영역 (3/5) */}
            <div className="lg:col-span-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-6 min-h-[600px]">
                {storyboard ? (
                  <div className="h-full">
                    {/* 결과 헤더 */}
                    <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                      <div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                          생성된 스토리보드
                        </h2>
                        <p className="text-gray-500 text-sm">AI가 생성한 창의적인 스토리보드입니다</p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            const dataStr = JSON.stringify(storyboard, null, 2);
                            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                            const exportFileDefaultName = `${storyboard.wholeTitle}_storyboard.json`;
                            const linkElement = document.createElement('a');
                            linkElement.setAttribute('href', dataUri);
                            linkElement.setAttribute('download', exportFileDefaultName);
                            linkElement.click();
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl hover:from-green-500 hover:to-emerald-600 transition-all shadow-lg font-medium text-sm"
                        >
                          JSON 다운로드
                        </button>
                        <button
                          onClick={generateDocx}
                          className="px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg font-medium text-sm"
                        >
                          DOCX 다운로드
                        </button>
                      </div>
                    </div>

                    {/* 스토리보드 결과 표시 */}
                    <div>
                      {/* 기본 정보 */}
                      <div className="mb-6 p-5 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl border border-purple-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{storyboard.wholeTitle}</h3>
                        <p className="text-gray-700 mb-4 text-sm leading-relaxed">{storyboard.storyTopic}</p>
                        <div className="flex flex-wrap gap-2">
                          {storyboard.hashtags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gradient-to-r from-purple-400 to-indigo-400 text-white rounded-full text-xs font-semibold shadow-sm"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 페이지별 스토리보드 */}
                      <div className="space-y-4">
                        {storyboard.pages.map((page, index) => (
                          <div key={index} className="bg-white/70 backdrop-blur-sm border border-gray-100 rounded-3xl p-5 shadow-lg">
                            <div className="mb-4">
                              <div className="inline-flex items-center bg-gradient-to-r from-purple-400 to-indigo-400 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-lg">
                                페이지 {page.page}
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <h5 className="font-bold text-gray-700 mb-2 text-sm">등장인물</h5>
                                <div className="flex flex-wrap gap-2">
                                  {page.character.map((char, charIndex) => (
                                    <span
                                      key={charIndex}
                                      className="px-3 py-1 bg-gradient-to-r from-emerald-400 to-teal-400 text-white rounded-full text-xs font-semibold shadow-sm"
                                    >
                                      {char}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h5 className="font-bold text-gray-700 mb-2 text-sm">배경</h5>
                                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-gray-100 shadow-sm">
                                  <p className="text-gray-700 text-sm leading-relaxed">{page.background}</p>
                                </div>
                              </div>

                              <div>
                                <h5 className="font-bold text-gray-700 mb-2 text-sm">대사</h5>
                                <div className="space-y-2">
                                  {Object.entries(page.dialogue).map(([character, dialogue], dialogueIndex) => (
                                    <div key={dialogueIndex} className="bg-white/80 backdrop-blur-sm rounded-2xl border-l-4 border-purple-400 p-3 shadow-sm">
                                      <div className="font-bold text-gray-800 text-sm mb-1">{character}</div>
                                      <div className="text-gray-700 text-sm leading-relaxed">"{dialogue}"</div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h5 className="font-bold text-gray-700 mb-2 text-sm">표정/포즈</h5>
                                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-gray-100 shadow-sm">
                                  <p className="text-gray-700 text-sm leading-relaxed">{page.expressionPose}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* JSON 미리보기 */}
                      <div className="mt-6">
                        <details className="bg-white/70 backdrop-blur-sm border border-gray-100 rounded-3xl overflow-hidden shadow-lg">
                          <summary className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 cursor-pointer font-bold text-gray-700 hover:from-gray-100 hover:to-gray-200 transition-all text-sm">
                            JSON 형식으로 보기
                          </summary>
                          <pre className="p-4 bg-gray-900 text-green-400 text-xs overflow-x-auto max-h-60 overflow-y-auto">
                            {JSON.stringify(storyboard, null, 2)}
                          </pre>
                        </details>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center">
                    <div className="max-w-md">
                      <div className="mb-6">
                        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-6 rounded-full mx-auto w-24 h-24 flex items-center justify-center shadow-lg">
                          <svg className="w-12 h-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                        스토리보드 생성 대기 중
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        왼쪽 입력 폼을 작성하고 '스토리보드 생성하기' 버튼을 클릭하면 AI가 창의적인 인스타툰 스토리보드를 생성해드립니다.
                      </p>
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-100">
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold text-purple-600">💡 팁:</span> 더 구체적인 정보를 입력할수록 더 정확한 스토리보드가 생성됩니다!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <footer className="max-w-6xl mx-auto mt-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg py-4 px-6 text-center">
            <p className="text-gray-600 font-medium text-sm">© 2024 인스타툰 스토리보드 생성기. Powered by OpenAI GPT-4.1</p>
          </div>
        </footer>
      </main>
    </>
  );
} 