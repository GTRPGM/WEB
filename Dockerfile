FROM nginx:stable-alpine

ARG WEB_PORT

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

# 빌드된 정적 파일 복사
COPY dist .

# Nginx 설정: 8080 포트 리스닝 및 SPA 라우팅 지원
RUN echo 'server { \
    listen ${WEB_PORT}; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE ${WEB_PORT}
CMD ["nginx", "-g", "daemon off;"]