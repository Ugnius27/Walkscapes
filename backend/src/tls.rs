use std::env;
use std::fs::File;
use std::io::BufReader;
use rustls::{Certificate, PrivateKey, ServerConfig};
use rustls_pemfile::{certs, pkcs8_private_keys};

pub fn load_rustls_config() -> ServerConfig {

    // init server config builder with safe defaults
    let config = ServerConfig::builder()
        .with_safe_defaults()
        .with_no_client_auth();

    // load TLS key/cert files
    let private_key_path = env::var("PRIVATE_KEY_PATH").unwrap();
    let certificate_chain_path = env::var("CERTIFICATE_CHAIN_PATH").unwrap();
    let cert_file = &mut BufReader::new(File::open(certificate_chain_path).unwrap());
    let key_file = &mut BufReader::new(File::open(private_key_path).unwrap());

    // convert files to key/cert objects
    let mut keys: Vec<PrivateKey> = pkcs8_private_keys(key_file)
        // .filter_map(Result::ok)
        .unwrap()
        .into_iter()
        .map(PrivateKey)
        .collect();

    let cert_chain: Vec<Certificate> = certs(cert_file)
        // .filter_map(Result::ok)
        .unwrap()
        .into_iter()
        .map(Certificate)
        .collect();

    // exit if no keys could be parsed
    if keys.is_empty() {
        eprintln!("Could not locate PKCS 8 private keys.");
        std::process::exit(1);
    }

    config.with_single_cert(cert_chain, keys.remove(0)).unwrap()
}