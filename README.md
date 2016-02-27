#Docker Development Container
This is a Dockerfile for a container that is run specifically for the development process. As containerization became more popular, it has become evident that nearly all aspects of programming can be containerized. This project specifically is geared towards removing the need for local npm setup with a task running. Using this image, a team can create a specific environment for their project and then distribute this image amongst all team members.

##Usage
This project can be used in conjunction with a docker-compose file, or simply by itself. To run this container build it through docker.

    $ docker build .

Further, I would recommend naming this container so that it is easier to access and run commands inside.

A docker-compose.yml has also been provided with the necessary inputs to run this in a different project. Copy the code contained in that file to your docker-compose.yml for your project. 

##Notes

### NFS

It is highly recommended that you change the mounted volumes to NFS. This drastically increases the speed by which the voluming syncing occurs. Without NFS, the mount will take significantly longer and slow the development process. Due to Dinghy not allowing maproot=0 (yet), there are issues running npm with Dinghy. Thus currently only [docker-machine-nfs](https://github.com/adlogix/docker-machine-nfs) can be recommend for mounting volumes with nfs. Further, it is important to change the mount settings so that gulp can respond to change files in a reasonable time. By changing the mount settings, Gulp can be reduced from a 1 minute response time to roughly 50 ms response time. See this (pull request)[https://github.com/adlogix/docker-machine-nfs/pull/38] for further details.

##Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

The code is available under the [MIT License](/LICENSE).
