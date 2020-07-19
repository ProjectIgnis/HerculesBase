FROM node:14-buster
WORKDIR /hercules-base
ENV NODE_ENV production
ENV DEBUG hercules-base*
ENV HERCULES_BASE_PORT 3000
ENV HERCULES_BASE_DB update.db
ENV HERCULES_BASE_SECRET SECRET_PRESHARED_KEY
COPY package*.json yarn.lock ./
RUN yarn
COPY . .
CMD ["node", "src/app.js"]
