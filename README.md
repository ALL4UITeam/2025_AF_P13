# 프로젝트 배포 가이드

## 📦 백엔드 개발자용 (Java/Spring Boot)

dist 폴더 복사
빌드 후 생성된 `dist` 폴더의 **전체 내용**을 Spring Boot 프로젝트의 `src/main/resources/static` 디렉토리에 복사하세요.

## 💻 프론트엔드 개발자용

### 개발 명령어

```bash
# 패키지 설치
npm install

# 개발 서버 실행 (포트: 5173)
npm run dev

# 프로덕션 빌드
npm run build
```

### 개발 가이드

#### 포털털 페이지 작업
- **스타일**: `src/scss/pages/portal/*_.scss`
- **스크립트**: `src/js/portal.js`
- **이미지**: `public/images/portal/`

#### 지도 페이지 작업
- **스타일**: `src/scss/pages/map/_map.scss`
- **스크립트**: `src/js/map.js`
- **이미지**: `public/images/map/`

#### 이미지 경로 사용 예시
```scss
body {
  background: url('/images/portal/logo.png') no-repeat center center;
}
```

### 기술 스택
- **빌드 도구**: Vite
- **개발 서버**: localhost:5173
- **스타일**: SCSS