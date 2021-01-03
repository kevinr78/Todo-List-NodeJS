//jshint esversion:6

const express = require("express");
const app = express();
const date = require("./utils/date.js");
const _ = require("lodash");
const {
  defaultItems,
  itemsModel,
  ListSchema,
  List,
} = require("./utils/models");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  const day = date.getDate();

  itemsModel.find({}, function (err, result) {
    if (result.length === 0) {
      itemsModel.insertMany(defaultItems, function (err) {
        if (err) {
          console.log("Error");
        } else {
          console.log("Succesfull");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: day, newListItems: result });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const ListName = req.body.list;

  const item = new itemsModel({
    Name: itemName,
  });

  if (ListName === date.getDate()) {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ Name: ListName }, function (err, result) {
      result.items.push(item);
      result.save();
      res.redirect("/" + ListName);
    });
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.chkbox;
  const deleteListName = req.body.listName;

  if (deleteListName === date.getDate()) {
    itemsModel.findByIdAndRemove(checkedItemId, function (err) {
      if (!err) {
        console.log("Succesfull");
      } else {
        console.log("error");
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { Name: deleteListName },
      { $pull: { items: { _id: checkedItemId } } },
      function (err, result) {
        if (!err) {
          res.redirect("/" + deleteListName);
        }
      }
    );
  }
});

app.get("/:NewList", function (req, res) {
  const paramName = _.capitalize(req.params.NewList);
  List.findOne({ Name: paramName }, function (err, Lists) {
    if (!err) {
      if (!Lists) {
        const list = new List({
          Name: paramName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + paramName);
      } else {
        res.render("list", {
          listTitle: Lists.Name,
          newListItems: Lists.items,
        });
      }
    }
  });
});
app.get("/about", function (req, res) {
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started succesfully");
});
