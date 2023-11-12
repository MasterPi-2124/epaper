const express = require("express");
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swaggerDocs.json");

var options = {
    // customJsStr: 'console.log("Swagger")'
  };

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerDocs, options));

module.exports = router;