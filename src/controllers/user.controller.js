const User = require("../models/user.model");
async function getAllUsers(request, reply){
    try{
        const users=await User.find();
        reply.send(users);
    }catch(error){
        reply.status(500).send(error);
    }
}
async function getUserById(request, reply){
    try{
        const users=await User.findById(request.params.id);
        reply.send(users);
    }catch(error){
        reply.status(500).send(error);
    }
}
async function createUser(request, reply){
    try{
        const user = new User(request.body);
        const result = user.save();
        reply.send(result);
    }catch(error){
        reply.status(500).send(error);
    }
}
async function deleteUser(request, reply){
    try{
        const users=await User.findByIdAndDelete(request.params.id);
        reply.status(203).send("");
    }catch(error){
        reply.status(500).send(error);
    }
}
async function updateUser(request, reply){
    try{
        const users=await User.findByIdAndUpdate(request.params.id,request.body,{new:true});
        reply.status(203).send("Updation Successful");
    }catch(error){
        reply.status(500).send(error);
    }
}
module.exports = {getAllUsers,createUser,getUserById,deleteUser,updateUser};