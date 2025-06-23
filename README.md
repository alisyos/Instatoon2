# 인스타툰 스토리보드 생성기

OpenAI API를 활용하여 사용자가 입력한 조건에 맞는 인스타툰 스토리보드 기획안을 자동으로 생성하는 웹 애플리케이션입니다.

## 🚀 주요 기능

- **AI 기반 스토리보드 생성**: OpenAI GPT-4o 모델을 사용하여 창의적인 스토리보드 제작
- **직관적인 사용자 인터페이스**: 간단한 폼으로 쉽게 입력 가능
- **상세한 스토리보드 출력**: 페이지별 등장인물, 배경, 대사, 표정/포즈 등 포함
- **JSON 다운로드**: 생성된 스토리보드를 JSON 형태로 내보내기
- **반응형 디자인**: 모바일과 데스크톱 모두 지원

## 📝 입력 항목

| 항목 | 필수 여부 | 설명 |
|------|-----------|------|
| 등장인물 | 선택 | 이름, 역할 등 간단히 입력 |
| 필수 키워드 및 주제 | 선택 | 꼭 들어가야 하는 키워드나 주제 |
| 줄거리 | **필수** | 인스타툰을 만들기 위한 줄거리 |
| 분량 | **필수** | 1-10페이지 (권장: 4-8페이지) |

## 📄 출력 형식

```json
{
  "wholeTitle": "전체 제목",
  "storyTopic": "핵심 주제·메시지",
  "hashtags": ["해시태그1", "해시태그2", "..."],
  "pages": [
    {
      "page": 1,
      "character": ["캐릭터1", "캐릭터2"],
      "background": "배경 설명",
      "dialogue": {
        "캐릭터1": "대사1",
        "캐릭터2": "대사2"
      },
      "expressionPose": "표정과 포즈 설명"
    }
  ]
}
```

## 🛠️ 설치 및 실행

### 1. 프로젝트 클론 및 의존성 설치

```bash
git clone <repository-url>
cd instatoon2
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 프로젝트 루트에 생성하고 OpenAI API 키를 설정합니다:

```bash
# .env.local
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

### 4. 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

## 🚀 Vercel 배포

이 프로젝트는 Vercel에 최적화되어 있습니다:

1. GitHub 리포지토리에 코드를 푸시합니다
2. Vercel에서 프로젝트를 import합니다
3. 환경 변수 `OPENAI_API_KEY`를 Vercel 대시보드에서 설정합니다
4. 배포를 진행합니다

## 🛡️ 보안 고려사항

- OpenAI API 키는 절대 클라이언트 측에 노출되지 않도록 합니다
- 환경 변수를 통해 API 키를 관리합니다
- API 사용량 모니터링을 권장합니다

## 📚 기술 스택

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4o API
- **Deployment**: Vercel

## 📄 라이선스

이 프로젝트는 ISC 라이선스 하에 배포됩니다.

## 🤝 기여하기

버그 리포트나 기능 제안은 이슈로 등록해 주세요.

---

© 2024 인스타툰 스토리보드 생성기. Powered by OpenAI. 