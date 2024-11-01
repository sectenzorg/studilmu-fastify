const companypoliciesController = require("../controllers/companypolicies.controller");
const auth = require("../middlewares/auth");
async function routes(fastify, options){
    fastify.get("/getallpolicy", { preHandler: auth }, companypoliciesController.getAllPolicy);
    fastify.post("/getpolicybydoc", { preHandler: auth }, companypoliciesController.getPolicyByDoc);
    fastify.post("/getpolicybydepartment", { preHandler: auth }, companypoliciesController.getPolicyByDepartment);
}
module.exports = routes;