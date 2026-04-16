FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Cho phép truyền API endpoint khi build (Cloud Run / Docker Hub)
ARG VUE_APP_APIURL
ENV VUE_APP_APIURL=${VUE_APP_APIURL}
RUN VUE_APP_APIURL=${VUE_APP_APIURL} npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g http-server@14
ENV PORT=8080
EXPOSE 8080
# Lắng trên 0.0.0.0:$PORT để Cloud Run/Kubernetes/Compose đều dùng được
CMD ["sh", "-c", "http-server ./dist -p ${PORT:-8080} -a 0.0.0.0"]
