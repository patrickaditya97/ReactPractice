import { observable, autorun, decorate } from "mobx";

class TodoStore{
    todos = ["buy Milk", "buy eggs", "buy cheese"]
    filter = ""
}

var store = window.store = new TodoStore()

decorate(TodoStore, {
    todos: observable,
    filter: observable,
  });

export default store

autorun(() => {
    console.log("filter", store.filter, "todos", store.todos)
})