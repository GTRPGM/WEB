FROM nginx:stable-alpine

# 빌드 인자 정의
ARG WEB_PORT

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY dist .

# 포트 변수를 실제 값으로 치환하여 설정 파일 생성
# 큰따옴표 내에서 변수를 확실히 처리하기 위해 구문을 수정했습니다.
RUN printf "server { \n\
    listen %s; \n\
    location / { \n\
        root /usr/share/nginx/html; \n\
        index index.html; \n\
        try_files \$uri \$uri/ /index.html; \n\
    } \n\
}" "${WEB_PORT}" > /etc/nginx/conf.d/default.conf

EXPOSE ${WEB_PORT}

CMD ["nginx", "-g", "daemon off;"]