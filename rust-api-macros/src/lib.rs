use proc_macro::TokenStream;

#[proc_macro]
pub fn color(item: TokenStream) -> TokenStream {
    let params: &str = &item.to_string();
    let params = params.trim();
    let params = params.split(" ");
    
    let mut colors: [u8; 3] = [0,0,0];
    for (i, param) in params.enumerate() {
        colors[i] = param.trim().parse::<u8>().expect("Expected a number in color macro call.");
        let c = (colors[i] as f32 / 256.0) * (2 as f32).powi(if i == 2 { 2 } else { 3 });
        colors[i] = c as u8;
    }
    
    let r = colors[0] << 5;
    let g = colors[1] << 2;
    let b = colors[2];
    let rgb: u8 = r | g | b;
    
    return format!("{:#010b}", rgb).parse::<TokenStream>().unwrap();
}
