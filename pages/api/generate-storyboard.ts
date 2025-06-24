import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { FormInput, ApiResponse } from '../../types/storyboard';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { characters, keywords, plot, pageCount }: FormInput = req.body;

    // 필수 필드 검증
    if (!plot || !pageCount) {
      return res.status(400).json({
        success: false,
        error: '줄거리와 분량은 필수 입력 항목입니다.',
      });
    }

    // OpenAI API 키 검증
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API 키가 설정되지 않았습니다.',
      });
    }

    // 프롬프트 생성
    const prompt = `
###지시사항
아래에 제공된 정보를 바탕으로, 독창적이면서도 명확한 스토리보드를 기획하십시오.

###작성지침
1. 필수 키워드·주제는 스토리 전반에 자연스럽게 녹여 넣으십시오.
2. 정방형(1 : 1) 이미지 ${pageCount}컷(${pageCount} 페이지) 이내에서 플롯이 매끄럽게 이어지도록 균형 있게 배분하십시오.
3. 각 페이지마다 반드시 등장인물·배경·대사·표정/포즈를 기재하십시오.
4. 대사는 캐릭터 이름을 앞에 붙여 표기하십시오 예) 지민: "대사…".
5. **대사량 중요**: 각 캐릭터의 대사는 충분히 길고 풍부하게 작성하십시오. 단순한 한 줄 대사가 아닌, 감정과 상황을 충실히 담은 2-3문장 이상의 대사로 구성하십시오. 캐릭터의 개성과 감정이 잘 드러나도록 자연스럽고 생동감 있는 대화를 만드십시오.
6. 표정/포즈는 연출자가 즉시 이해할 만큼 구체적으로 기술하십시오.
7. 1 컷(페이지) = 1 JSON 객체이며, page 번호를 필수로 포함하십시오(업로드 순서 고정 목적).
8. 세이프 존(1080×1080 px 기준, 가장자리 120 px) 밖에 핵심 텍스트·캐릭터가 걸치지 않도록 유의하십시오.

###추가 세부 가이드
- 디자인‧연출: 컬러 팔레트·폰트·톤&매너를 일관되게 유지, 컷 간 시선 흐름(좌→우·상→하) 고려

###출력형식
다음 JSON 형식으로만 응답하십시오:
{
  "wholeTitle": "완결성 있는 한글 제목",
  "storyTopic": "핵심 주제·메시지를 1-2문장으로 요약",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
  "pages": [
    {
      "page": 1,
      "character": ["캐릭터1", "캐릭터2"],
      "background": "배경 설명",
      "dialogue": {
        "캐릭터1": "대사1",
        "캐릭터2": "대사2"
      },
      "expressionPose": "주요 인물들의 표정과 액션"
    }
  ]
}

###입력 정보
등장인물: ${characters || '자유롭게 설정'}
필수 키워드 및 주제: ${keywords || '없음'}
줄거리: ${plot}
분량: ${pageCount}장
`;

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1',  // 최신 모델인 gpt-4.1 사용
      messages: [
        {
          role: 'system',
          content: '당신은 전문적인 인스타툰 스토리보드 기획자입니다. 사용자의 요청에 따라 창의적이고 매력적인 스토리보드를 JSON 형식으로 제공합니다.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('OpenAI로부터 응답을 받지 못했습니다.');
    }

    // JSON 파싱
    let storyboard;
    try {
      storyboard = JSON.parse(content);
    } catch (parseError) {
      // JSON 파싱 실패 시 재시도
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        storyboard = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('올바른 JSON 형식의 응답을 받지 못했습니다.');
      }
    }

    return res.status(200).json({
      success: true,
      data: storyboard,
    });

  } catch (error) {
    console.error('스토리보드 생성 오류:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    });
  }
} 