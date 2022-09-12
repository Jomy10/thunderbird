pub fn init() {
    std::panic::set_hook(Box::new(|p| {
        let s = p.to_string();
        crate::print_err(&s);
    }));
}
