use std::collections::HashMap;
use serde::{Serialize, Deserialize};


#[derive(Serialize, Deserialize, Debug)]
pub enum Action {
  AddNode(String),
  UpdateNode(String),
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Node {
  x: i32,
  y: i32,
  inputs: Vec<String>,
  outputs: Vec<(String, Vec<(String, i32)>)>,
}

pub type State = HashMap<String, Node>;

pub fn reducer(state: State, action: Action) -> State {
  // "reducer".to_string()
  match action {
    Action::AddNode(something) => {
      state
    }
    Action::UpdateNode(what) => {
      state
    }
  }
}
