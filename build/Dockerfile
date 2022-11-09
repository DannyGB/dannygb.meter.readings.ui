FROM node:latest as build

WORKDIR /usr/local/app

COPY . /usr/local/app/

RUN npm install
RUN npm run build


FROM nginx:latest

COPY --from=build /usr/local/app/assets/images/ /usr/share/nginx/html/images
COPY --from=build /usr/local/app/build/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/local/app/build/security-headers.conf /etc/nginx/security-headers.conf
COPY --from=build /usr/local/app/dist/meter.readings.ui /usr/share/nginx/html

EXPOSE 80