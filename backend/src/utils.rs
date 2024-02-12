use std::ops::Add;

pub fn truncate_string(s: &str, max_length: usize) -> String {
    if s.len() <= max_length {
        String::from(s)
    } else {
        String::from(&s[..max_length]).add("...")
    }
}
