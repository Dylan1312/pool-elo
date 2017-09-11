FROM mkenney/npm:7.0-alpine as compiler

ADD package.json /mycode/
WORKDIR /mycode

RUN npm install

ADD . /mycode

RUN npm run deploy:prod

FROM pierrezemb/gostatic

COPY --from=compiler /mycode/dist/ /srv/http/
