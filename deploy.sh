IP=walkscapes
ssh $IP "rm -rf walkscapes && mkdir walkscapes && cd walkscapes && mkdir backend"
tar czf - frontend | ssh walkscapes "tar xzf - -C /home/ugnius/walkscapes"
scp backend/target/x86_64-unknown-linux-gnu/release/walkscapes walkscapes:/home/ugnius/walkscapes/backend
#scp backend/target/release/walkscapes walkscapes:/home/ugnius/walkscapes/backend
scp backend/.env walkscapes:/home/ugnius/walkscapes/backend
ssh walkscapes "sudo systemctl restart walkscapes"
echo "DONE!"