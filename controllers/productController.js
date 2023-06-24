const { Product } = require("../models");
// creating product
const createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name) {
      return res.status(400).json({ message: "name cannot be empty" });
    }
    if (!price) {
      return res.status(400).json({ message: "name cannot be empty" });
    }
    const createProduct = await Product.create({
      productName: name,
      productPrice: price,
    });
    res.status(200).send({
      status: true,
      message: "Successfully created the product",
      createProduct,
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: "Error in Creating Product",
    });
  }
};

// fetching all products
const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.findAll();
    res.status(200).send({
      status: true,
      message: "Successfully fetched all the products",
      allProducts,
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: "Error in Fetching Products",
    });
  }
};

//getting Single Product
const getSingleProduct = async (req, res) => {
  try {
    const singleProduct = await Product.findOne({
      where: { id: req.params.id },
    });
    res.status(200).send({
      status: true,
      message: "Successfully fetched the product",
      singleProduct,
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: "Error in Fetching Single Product",
    });
  }
};

// delete product
const deleteProduct = async (req, res) => {
  try {
    const deleteProduct = await Product.destroy({
      where: { id: req.params.id },
    });
    res.status(200).send({
      status: true,
      message: "Successfully Deleted the product",
      deleteProduct,
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: "Error in Deleting Product",
    });
  }
};

//update product
const updateProduct = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, price } = req.body;
    if (!name) {
      res.status(400).json({ message: "name cannot be empty" });
    }
    if (!price) {
      res.status(400).json({ message: "price cannot be empty" });
    }
    await Product.update(
      {
        productName: name,
        productPrice: price,
      },
      { where: { id: userId } }
    );
    res.status(200).send({
      status: true,
      message: "Successfully updated the product",
    });
  } catch (error) {
    res.status(400).send({
      status: false,
      message: "Error in Updating Product",
    });
  }
};
module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
};
