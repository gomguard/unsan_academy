# Unsan Academy

자동차 정비사를 위한 게이미피케이션 기반 경력 관리 플랫폼

## 기술 스택

### Backend
- Django 4.2
- Django REST Framework
- SQLite (개발용)

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Recharts (레이더 차트)
- Framer Motion (애니메이션)
- Zustand (상태 관리)
- Lucide React (아이콘)

## 프로젝트 구조

```
unsan_academy/
├── backend/
│   ├── api/                 # Django API 앱
│   │   ├── models.py        # 데이터 모델
│   │   ├── serializers.py   # DRF 시리얼라이저
│   │   ├── views.py         # API 뷰
│   │   └── urls.py          # URL 라우팅
│   ├── unsan_academy/       # Django 프로젝트 설정
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/      # React 컴포넌트
    │   ├── pages/           # 페이지 컴포넌트
    │   ├── store/           # Zustand 상태 관리
    │   ├── lib/             # 유틸리티 및 Mock 데이터
    │   └── types/           # TypeScript 타입 정의
    ├── package.json
    └── vite.config.ts
```

## 설치 및 실행

### 1. Python 설치
[Python 3.10+](https://www.python.org/downloads/) 설치 필요

### 2. Node.js 설치
[Node.js 18+](https://nodejs.org/) 설치 필요

### 3. Backend 설정

```bash
cd backend

# 가상환경 생성 및 활성화
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# 패키지 설치
pip install -r requirements.txt

# 데이터베이스 마이그레이션
python manage.py migrate

# Mock 데이터 생성
python manage.py setup_mock_data

# 서버 실행 (포트 8000)
python manage.py runserver
```

### 4. Frontend 설정

```bash
cd frontend

# 패키지 설치
npm install

# 개발 서버 실행 (포트 5173)
npm run dev
```

### 5. 브라우저에서 접속
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/

## 주요 기능

### 대시보드
- 사용자 프로필 및 티어 표시
- Penta-Stat 레이더 차트 (Tech, Hand, Speed, Art, Biz)
- 티어 진행 상황 표시

### Job Cards
- 전설 카드 컬렉션
- 잠금/해제 상태 시각화
- 카드 상세 보기 (플립 애니메이션)

### SOP 미션
- 일일 미션 리스트
- 완료 시 스탯 상승 애니메이션
- 토스트 알림

## API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/profiles/` | 프로필 목록 |
| GET | `/api/profiles/{id}/` | 프로필 상세 |
| POST | `/api/profiles/{id}/complete_task/` | 태스크 완료 |
| GET | `/api/cards/` | 잡 카드 목록 |
| GET | `/api/tasks/` | 태스크 목록 |
| GET | `/api/dashboard/{profile_id}/` | 대시보드 데이터 |

## 개발 모드 데모 계정

- Username: `demo_mechanic`
- Password: `demo1234`
- Profile ID: `1`

## 향후 계획 (Phase 2+)

- [ ] 사용자 인증 시스템
- [ ] 실제 이미지 업로드
- [ ] 관리자 대시보드
- [ ] 푸시 알림
- [ ] 리더보드
- [ ] 팀/그룹 기능

## 라이센스

MIT License
