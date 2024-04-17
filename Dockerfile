FROM node:19-bullseye
COPY server /server
COPY ./.env /server
WORKDIR /server
RUN npm install
CMD ["node", "index.js"]
EXPOSE 8080
