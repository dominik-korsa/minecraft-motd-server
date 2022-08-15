FROM node:16-alpine
WORKDIR /app
COPY package.json /app/package.json
RUN npm install --omit=dev
COPY src /app/src
ENV PORT=25565
EXPOSE 25565
CMD ["npm", "run", "start"]
