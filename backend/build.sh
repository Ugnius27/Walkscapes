#RUSTFLAGS='-C target-feature=+crt-static' cargo b --release --target x86_64-unknown-linux-gnu
#RUSTFLAGS='-C target-feature=+crt-static'
cargo b --release --target armv7-unknown-linux-gnueabihf
