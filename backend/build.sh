DATABASE_URL='mysql://dev:Eb2RXM7kcwDySpRz6etXAadQpNygsrNeLtU795X2@192.168.0.87:3306/walkscapes'
#DATABASE_URL=mysql://dev:Eb2RXM7kcwDySpRz6etXAadQpNygsrNeLtU795X2@78.57.131.223:3306/walkscapes

RUSTFLAGS='-C target-feature=+crt-static' cargo b --release --target armv7-unknown-linux-gnueabihf
#RUSTFLAGS='-C target-feature=+crt-static' cargo b --release --target x86_64-unknown-linux-gnu

