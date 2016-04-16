FROM alpine:edge

RUN apk --no-cache add nodejs ruby git python make g++

#Copy over the default Package.json
COPY ./gulp/package.json /usr/src/app/

#Copy over the default Gulpfile
COPY ./gulp/Gulpfile.js /usr/src/app/

WORKDIR /usr/src/app/

RUN npm update && npm install && npm cache clean

#Copy over, and grant executable permission to the startup script
COPY ./entrypoint.sh /
RUN chmod +x /entrypoint.sh

#Run Startup script
ENTRYPOINT [ "/entrypoint.sh" ]
