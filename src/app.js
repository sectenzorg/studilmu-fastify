const fastify = require("fastify")({logger: true});
const mongoose = require('mongoose');
require("dotenv").config();
const auth = require("./middlewares/auth");
//import routes
const userRoutes = require("./routes/user.routes");
const mastermenusRoutes = require("./routes/mastermenus.routes");
const employeesRoutes = require("./routes/employees.routes");
const useraccessRoutes = require("./routes/useraccess.routes");
const issuelogsRoutes = require("./routes/issuelogs.routes");
//connect database
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("connected to DB"))
.catch((e) => console.log("Error connecting to DB",e));
//start server
fastify.register(userRoutes, {prefix: '/api/v1/users'});
fastify.register(mastermenusRoutes, {prefix: '/api/v1/menu'});
fastify.register(employeesRoutes, {prefix: '/api/v1/emp'});
fastify.register(useraccessRoutes, {prefix: '/api/v1/usraccess'});
fastify.register(issuelogsRoutes, {prefix: '/api/v1/issuelogs'});
const start = async () => {
    try {
        await fastify.listen({
            port: parseInt(process.env.PORT || "5000"),
            host: "0.0.0.0",
        });
        fastify.log.info(`Server is running on port ${process.env.PORT}`);
    } catch (error) {
        console.log(error);
    }
};
start();