FROM node:20

WORKDIR src/app

COPY package* .

RUN npm install
RUN npm build

COPY . . 

EXPOSE 5173

CMD ["npm","start"]