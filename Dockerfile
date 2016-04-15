FROM alpine:edge

RUN apk --no-cache add nodejs ruby

#Copy over the default Package.json
COPY ./package.json /usr/src/app/

#Copy over the default Gulpfile
COPY ./Gulpfile.js /usr/src/app/

#Copy over, and grant executable permission to the startup script
COPY ./entrypoint.sh /
RUN chmod +x /entrypoint.sh

#Run Startup script
ENTRYPOINT [ "/entrypoint.sh" ]
