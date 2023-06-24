const { Router } = require("express");
const { authenticateUser } = require("../middlewares/superMiddleware");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");
const {
  productCreationAccess,
  productReadAccess,
  productDeleteAccess,
  productUpdateAccess,
} = require("../middlewares/permissionsMiddleware");
const router = Router();

router.post(
  "/addProduct",
  authenticateUser,
  productCreationAccess,
  createProduct
);
router.get(
  "/gettAllProducts",
  authenticateUser,
  productReadAccess,
  getAllProducts
);
router.get(
  "/getSingleProduct/:id",
  authenticateUser,
  productReadAccess,
  getSingleProduct
);
router.delete(
  "/deleteProduct/:id",
  authenticateUser,
  productDeleteAccess,
  deleteProduct
);
router.put(
  "/updateProduct/:id",
  authenticateUser,
  productUpdateAccess,
  updateProduct
);
module.exports = router;
