Check certificates Dockerfile in order to execute the peerjs server:
docker build -t my-peerjs-server .
docker run -p 9000:9000 -d my-peerjs-server