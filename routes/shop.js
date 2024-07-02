const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  return res.send("GET request to the homepage");
});

// CATEGORY ROUTES

router.get("/categories", function (req, res) {
  return res.send("GET request to show all categories");
});

router.get("/category/create", function (req, res) {
  return res.send("GET request to create category");
});

router.post("/category/create", function (req, res) {
  return res.send("POST request to create category");
});

router.get("/category/:id", function (req, res) {
  return res.send(`GET request to category ${req.params.id}`);
});

router.post("/category/:id/delete", function (req, res) {
  return res.send(`POST request to delete category ${req.params.id}`);
});

router.get("/category/:id/update", function (req, res) {
  return res.send(`GET request to update category ${req.params.id}`);
});

router.post("/category/:id/update", function (req, res) {
  return res.send(`POST request to update category ${req.params.id}`);
});

// ITEM ROUTES

router.get("/items", function (req, res) {
  return res.send("GET request to show all items");
});

router.get("/item/create", function (req, res) {
  return res.send("GET request to create item");
});

router.post("/item/create", function (req, res) {
  return res.send("POST request to create item");
});

router.get("item/:id", function (req, res) {
  return res.send(`GET request to item ${req.params.id}`);
});

router.get("item/:id/update", function (req, res) {
  return res.send(`GET request to update item ${req.params.id}`);
});

router.post("item/:id/update", function (req, res) {
  return res.send(`POST request to update item ${req.params.id}`);
});

router.post("item/:id/delete", function (req, res) {
  return res.send(`POST request to delete item ${req.params.id}`);
});
