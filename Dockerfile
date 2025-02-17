FROM node:20.11.1-alpine as node

# set working directory
WORKDIR /usr/src/app

# add .bin to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install package.json (o sea las dependencies)
RUN npm install -g @angular/cli@18.0.3
COPY package*.json ./

RUN npm install

# add app
COPY . ./

# build app
RUN npx ng build

# stage 2
FROM nginx:1.17.1-alpine

COPY --from=node /usr/src/app/dist/sopcom-cont/browser/ /usr/share/nginx/html/
COPY /nginx.conf /etc/nginx/nginx.conf

#COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]