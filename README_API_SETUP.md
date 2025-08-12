# OpenAI API 설정 가이드

## 1. OpenAI API 키 발급

1. [OpenAI Platform](https://platform.openai.com)에 접속
2. 로그인 또는 회원가입
3. API Keys 메뉴에서 새 API 키 생성
4. 생성된 키를 안전한 곳에 복사

## 2. 환경 변수 설정

`.env.local` 파일을 열고 다음과 같이 수정:

```env
# OpenAI API Key
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx  # 여기에 실제 API 키 입력

# Optional: Model configuration
OPENAI_MODEL=gpt-4-turbo-preview  # 또는 gpt-3.5-turbo (더 저렴)
MAX_TOKENS=4000
```

## 3. 서버 재시작

```bash
# 서버 중지 (Ctrl+C)
# 서버 재시작
npm run dev
```

## 4. 테스트

1. http://localhost:3000/scanner 접속
2. 계약서 파일 업로드
3. 개인정보 처리방침 동의 체크
4. "분석 시작" 클릭

## 주의사항

- API 키는 절대 GitHub에 커밋하지 마세요
- `.env.local` 파일은 `.gitignore`에 포함되어 있습니다
- API 키가 없으면 자동으로 목업 데이터가 표시됩니다

## 비용 관련

- GPT-4: 더 정확하지만 비용이 높음 (~$0.03/1K tokens)
- GPT-3.5-turbo: 비용 효율적 (~$0.001/1K tokens)
- 평균 계약서 분석: 2,000-4,000 토큰 사용

## 문제 해결

### API 키 오류
- 브라우저 콘솔에서 "OpenAI API 키가 설정되지 않았습니다" 메시지 확인
- `.env.local` 파일에 올바른 API 키가 있는지 확인
- 서버를 재시작했는지 확인

### 분석이 작동하지 않을 때
- 브라우저 개발자 도구(F12) > Console 탭 확인
- 네트워크 탭에서 `/api/analyze` 요청 확인
- 서버 터미널에서 에러 메시지 확인