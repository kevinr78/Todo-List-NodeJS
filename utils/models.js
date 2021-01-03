const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemsSchema = {
  Name: String,
};
const itemsModel = mongoose.model("item", itemsSchema);

const item1 = new itemsModel({
  Name: "Welcome to your Todo List",
});

const item2 = new itemsModel({
  Name: "Hit +  button to add new items",
});

const item3 = new itemsModel({
  Name: "Check items to delete ",
});

const defaultItems = [item1, item2, item3];

const ListSchema = {
  Name: String,
  items: [itemsSchema],
};
const List = mongoose.model("List", ListSchema);

module.exports = {
  defaultItems,
  itemsModel,
  ListSchema,
  List,
};
