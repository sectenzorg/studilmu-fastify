const Employees = require("../models/employees.model");
const Useraccess = require("../models/useraccess.model");
const Issuelogs = require("../models/issuelogs.model");
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);
const bcrypt = require('bcryptjs');
const Mastermenus = require("../models/mastermenus.model");
async function getjakartatime(request, reply){
    var ack = 1;
    var msg = "";
    var statuscode = 200;
    try{
        var msg = dayjs().tz("Asia/Jakarta").format();
        reply.send(msg);
    }catch(error){
        reply.send(error);
    }
}
async function getAllEmployee(request, reply){
    try{
        //initial value
        var ack = 1;
        var msg = "";
        var statuscode = 200;
        var resp = "";
        var employees=await Employees.find();
        msg = "OK";
    }catch(error){
        statuscode = 500;
        ack = 0;
        msg = error;
    }
    resp = {
        "statuscode"    : statuscode,
        "ack"           : ack,
        "message"       : msg,
        "datares"       : employees
    }
    reply.send(resp);
}
async function getAllEmployeeByCode(request, reply){
    try{
        //initial value
        var ack = 1;
        var msg = "";
        var statuscode = 200;
        var resp = "";
        var searchTerm = request.body.searchdata;
        var charCount = searchTerm.length;
        if(charCount === 0){
            ack = 0;
            msg = "Invalid parameters";
            var employees = [];
        }else{
            let trimmedSearchCode = searchTerm.trim();
            var employees = await Employees.aggregate([
                {$match: {
                        'companycode': { $regex: trimmedSearchCode, $options: 'i' }
                    }
                }
            ]);
            if(employees!=''){
                var employees = employees;
                msg = "OK";
            }else{
                ack = 0;
                msg = "No Data Found";
                var employees = [];
            }
        }
    }catch(error){
        statuscode = 500;
        ack = 0;
        msg = error;
    }
    resp = {
        "statuscode"    : statuscode,
        "ack"           : ack,
        "message"       : msg,
        "datares"       : employees
    }
    reply.send(resp);
}
async function getAllEmployeeByDept(request, reply){
    try{
        //initial value
        var ack = 1;
        var msg = "";
        var statuscode = 200;
        var resp = "";
        var searchTerm = request.body.searchdata;
        var charCount = searchTerm.length;
        if(charCount === 0){
            ack = 0;
            msg = "Invalid parameters";
            var employees = [];
        }else{
            let trimmedSearchCode = searchTerm.trim();
            var employees = await Employees.aggregate([
                {$match: {
                        'deptname': { $regex: trimmedSearchCode, $options: 'i' }
                    }
                }
            ]);
            if(employees!=''){
                var employees = employees;
                msg = "OK";
            }else{
                ack = 0;
                msg = "No Data Found";
                var employees = [];
            }
        }
    }catch(error){
        statuscode = 500;
        ack = 0;
        msg = error;
    }
    resp = {
        "statuscode"    : statuscode,
        "ack"           : ack,
        "message"       : msg,
        "datares"       : employees
    }
    reply.send(resp);
}
async function getEmployeeById(request, reply){
    try{
        //initial value
        var ack = 1;
        var msg = "";
        var statuscode = 200;
        var resp = "";
        var eid = request.body.empid;
        var charCount = eid.length;
        if(charCount === 0){
            ack = 0;
            msg = "Invalid parameters";
            var employees = [];
        }else{
            var employees=await Employees.findById(eid);
            msg = "OK";
        }
    }catch(error){
        statuscode = 500;
        ack = 0;
        msg = error;
    }
    resp = {
        "statuscode"    : statuscode,
        "ack"           : ack,
        "message"       : msg,
        "datares"       : employees
    }
    reply.send(resp);
}
async function addEmployee(request, reply){
    var ack = 1;
    var msg = "";
    var statuscode = 200;
    var resp = "";
    try{
        const employees = new Employees(request.body.empdata);
        const result = employees.save();
        const useraccess = new Useraccess(request.body.accessdata);
        const resultaccess = useraccess.save();
        if(result && resultaccess){
            msg = "OK";
        }else{
            msg = "Not OK";
        }
    }catch(error){
        statuscode = 500;
        ack = 0;
        msg = error;
    }
    resp = {
        "statuscode"    : statuscode,
        "ack"           : ack,
        "message"       : msg
    }
    reply.send(resp);
}
async function editemployee(request, reply){
    var ack = 1;
    var msg = "";
    var statuscode = 200;
    var resp = "";
    try{
        let empid = request.body.userid;
        let useraccessid = request.body.useraccessid;
        let type = request.body.usertype;
        let empdt=request.body.empdata;
        if(type==='1'){
            const result=await Employees.findByIdAndUpdate(
                empid, // Find the document by _id
                { $set: empdt },   // Update menudata fields
                { new: true }  );       // Return the updated document);
            const resultaccess=await Useraccess.findByIdAndUpdate(
                useraccessid, // Find the document by _id
                { $set: request.body.accessdata },   // Update menudata fields
                { new: true }  );       // Return the updated document);
            msg = "OK";
        }else{
            const updateFields ={
                "domaddress":empdt.domaddress
            };
            updateFields["contactno"] = request.body.empdata.contactno;
            updateFields["personalemail"] = empdt.personalemail;
            updateFields["bloodtype"] = empdt.bloodtype;
            updateFields["emergencycontact"] = request.body.empdata.emergencycontact;
            const resultEmp = await Employees.updateOne(
                { _id: empid },
                { $set: updateFields }
            );
            if (resultEmp.modifiedCount > 0) {
                msg = "OK";
            } else {
                msg = "Employee not found";
            }
        }
    }catch(error){
        console.log(error);
        statuscode = 500;
        ack = 0;
        msg = error;
    }
    resp = {
        "statuscode"    : statuscode,
        "ack"           : ack,
        "message"       : msg
    }
    reply.send(resp);
}
async function passencrypt(request, reply) {
    const saltRounds = 10;
    var password = request.body.pass;
    var encryptedpass=await bcrypt.hash(password, saltRounds);
    resp = {
        "statuscode"    : 200,
        "ack"           : 'OK',
        "message"       : encryptedpass
    }
    reply.send(resp);
}
async function passwordverify(request, reply) {
    var password = request.body.pass;
    var hash = request.body.hash;
    var result = await bcrypt.compare(password, hash);
    resp = {
        "statuscode"    : 200,
        "ack"           : 'OK',
        "message"       : result
    }
    reply.send(resp);
}
async function login(request, reply){
    var ack = 1;
    var msg = "";
    var statuscode = 200;
    var resp = "";
    try {
        let uid = request.body.userid;
        var password = request.body.pass;
        var flg = request.body.isemail;
        if(flg==1){
            var useraccess = await Useraccess.find({ officeemail: uid });
        }else{
            var useraccess = await Useraccess.find({ empid: uid });
        }
        if(useraccess.length===0){
            statuscode = 500;
            ack = 0;
            msg = 'Invalid Email or Employee code';
        }else{
            const isValid = await bcrypt.compare(password,useraccess[0].password);
            if(isValid){
                if(flg==1){
                    var employeedata = await Employees.find({ officeemail: uid });
                }else{
                    var employeedata = await Employees.find({ empid: uid });
                }
                msg = 'Login Successful';
                var response={ user_access: useraccess, emp_data: employeedata };
            }else{
                statuscode = 401;
                ack = 0;
                msg = 'Invalid Password';
            }
        }
    } catch (error) {
        var currentDateTime = dayjs().tz("Asia/Jakarta").format();
        var logData = {
            logtime: currentDateTime,
            menucode: "menu123",
            logcategory: "error",
            apistatus: "failed",
            sysmessage: error,
            humanmessage: "An error occurred",
            userid: "user123",
            username: "John Doe",
            useremail: "john@example.com",
            action: "create",
            docid: "doc123"
        };
        const issuelog = new Issuelogs(logData);
        const issuelogresult = issuelog.save();
        statuscode = 500;
        ack = 0;
        msg = error;
    }
    resp = {
        "statuscode"    : statuscode,
        "ack"           : ack,
        "message"       : msg,
        "datares"       : response
    }
    reply.send(resp);
}
async function updatePassword(request, reply){
    var ack = 1;
    var msg = "";
    var statuscode = 200;
    var resp = "";
    try {
        const saltRounds = 10;
        let empid = request.body.empid;
        var rawpassword = request.body.pass;
        var encryptedpass=await bcrypt.hash(rawpassword, saltRounds);
        const updatedEmployee = await Employees.findOneAndUpdate(
            { empid: empid },  // Query to find the employee by empid
            { password: encryptedpass },  // Update the password field
            { new: true }  // Return the updated document
        );
        if (updatedEmployee) {
            msg = "Password updated successfully";
        } else {
            msg = "Employee not found";
        }
    } catch (error) {
        statuscode = 500;
        ack = 0;
        msg = error;
    }
    resp = {
        "statuscode"    : statuscode,
        "ack"           : ack,
        "message"       : msg,
        "datares"       : []
    }
    reply.send(resp);
}
module.exports = {
    getjakartatime,
    getAllEmployee,
    getAllEmployeeByCode,
    getAllEmployeeByDept,
    getEmployeeById,
    addEmployee,
    editemployee,
    login,
    passencrypt,
    passwordverify,
    updatePassword
};