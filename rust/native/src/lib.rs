// use neon::register_module;
// use neon_serde::export;
// use core;


// export! {
//   // fn reducer(state: core::State, action: core::Action) -> String {
//   fn reducer(state: core::State) -> String {
//   // fn reducer() -> String {
//     format!("hi")
//     // Ok(JsString::new(&mut cx, core::reducer(state, action)))
//   }
// }

// // register_module!(mut cx, {
// //   cx.export_function("reducer", reducer)?;
// //   Ok(())
// // });


use node_bindgen::derive::node_bindgen;
use node_bindgen::core::val::JsEnv;
use node_bindgen::core::val::JsObject;
use node_bindgen::core::JSValue;
use node_bindgen::sys::napi_value;
use node_bindgen::core::NjError;

#[derive(Default)]
struct Json {
    val: i32,
    name: Option<String>
}


/// accept integer 
/// or json
enum MyParam {
    Val(i32),
    Json(Json)
}

/// accept argument either int or json 
#[node_bindgen]
fn add(arg_opt: Option<MyParam>) -> i32 {

    if let Some(arg) = arg_opt {
        match arg {
            MyParam::Val(val) => val * 10,
            MyParam::Json(json) => json.val * 10
        }
    } else {
        0
    }
    
}