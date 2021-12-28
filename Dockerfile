FROM node

ENV PORT 80

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install
COPY . .

RUN npm run build

EXPOSE 80

CMD [ "npm", "run", "start" ]
