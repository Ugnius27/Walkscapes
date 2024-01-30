IP=walkscapes
BACKEND_SOURCE_PATH=backend/target/armv7-unknown-linux-gnueabihf/release/walkscapes
BACKEND_DESTINATION_PATH=walkscapes:/home/ugnius/walkscapes/backend

ssh $IP "cd walkscapes && rm -rf frontend && cd backend && rm walkscapes"
tar czf - frontend | ssh $IP "tar xzf - -C /home/ugnius/walkscapes"
scp $BACKEND_SOURCE_PATH $BACKEND_DESTINATION_PATH
ssh walkscapes "sudo systemctl restart walkscapes"
echo "DONE!"