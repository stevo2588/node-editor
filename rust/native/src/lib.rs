use neon::prelude::*;

register_module!(mut cx, {
    cx.export_function("hello", |mut cx: FunctionContext| Ok(JsString::new(&mut cx, core::hello())))
});
