# taasiyeda-taki
Simple Taki Game as a demo application

## Requirements(general installation)
* npm
* nodejs 10
* git

## Requirements(for docker installation)
* docker

## Install requirements (Centos 7)

```bash
sudo yum install npm nodejs git 
```

## Common setup

Clone the repo and install the dependencies.

```bash
git clone https://github.com/vitaly-fintier/taasiyeda-taki.git
cd taasiyeda-taki
```

## Run application with npm
```bash
npm install
node server/server.js
```
## Or

## Build and run application in Docker container
User which executes docker commands must be in "docker" group on host, 
and group "docker" must have rw permission on docker socket(i.e /var/run/docker.sock)

```bash
docker build -t taasiyeda-taki .
docker run -d --name=taasiyeda-taki -p 8080:8080 taasiyeda-taki
```

## Access to application
Connect to server public IP , port 8080 (http://<SERVER_IP>:8080) and start playing.
Test locally using curl
```bash
curl localhost:8080
```


