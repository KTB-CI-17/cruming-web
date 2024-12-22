# 1. Node.js 기반의 빌드 환경 설정
FROM node:18 AS build

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. Build Arguments
ARG VITE_KAKAO_REST_API_KEY
ARG VITE_KAKAO_LOGIN_REDIRECT_URL
ARG VITE_BACKEND_API_BASE_URL

# 4. 환경 변수 설정
ENV VITE_KAKAO_REST_API_KEY=$VITE_KAKAO_REST_API_KEY
ENV VITE_KAKAO_LOGIN_REDIRECT_URL=$VITE_KAKAO_LOGIN_REDIRECT_URL
ENV VITE_BACKEND_API_BASE_URL=$VITE_BACKEND_API_BASE_URL

# 5. 패키지 파일 복사 및 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 6. 프로젝트 소스 코드 복사
COPY . .

# 7. 정적 파일 빌드
RUN npm run build

# 8. 정적 파일만 제공
FROM node:18

WORKDIR /app

COPY --from=build /app/dist /usr/share/app

# 9. HTTP 서버 실행
RUN npm install -g serve
CMD ["serve", "-s", "/usr/share/app", "-l", "80"]