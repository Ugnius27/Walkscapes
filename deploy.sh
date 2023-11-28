#garbage
ssh ugnsta@158.129.1.132 "rm -rf walkscapes && mkdir walkscapes && cd walkscapes && mkdir backend"
scp -r frontend ugnsta@158.129.1.132:/home/ugnsta/walkscapes
scp backend/target/x86_64-unknown-linux-gnu/release/walkscapes ugnsta@158.129.1.132:/home/ugnsta/walkscapes/backend
