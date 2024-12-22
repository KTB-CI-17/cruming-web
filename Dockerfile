# 1. Node.js 기반의 빌드 환경 설정
FROM node:18 AS build

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 패키지 파일 복사 및 의존성 설치
COPY package.json package-lock.json ./
RUN npm install

# 4. 프로젝트 소스 코드 복사
COPY . .

# 5. 정적 파일 빌드
RUN npm run build

# 6. Nginx 이미지 설정
FROM nginx:1.25

# 7. 빌드된 정적 파일 복사
COPY --from=build /app/dist /usr/share/nginx/html

# 8. 포트 노출
EXPOSE 80

# 9. 컨테이너 실행 시 Nginx 시작
CMD ["nginx", "-g", "daemon off;"]