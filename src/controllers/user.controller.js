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
const generateVoucherCode = (digitalorEventCode, periodStartDate, classSession, coursePrice, uniqueChar, yrdt, courseCode) => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    let unique=uniqueChar;
    let crsCd=courseCode;
    let yrlstdgt = yrdt.toString().slice(-1);
    for (let i = 0; i < unique; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }
    return `${digitalorEventCode}${yrlstdgt}${classSession}${periodStartDate}${crsCd}${coursePrice}${code}`;
};
const createVoucherObject = (digitalorEventCode, periodStartDate, classSession, coursePrice, uniqueChar, yrdt, courseCode) => {
    return {
        voucherCode: generateVoucherCode(digitalorEventCode, periodStartDate, classSession, coursePrice, uniqueChar, yrdt, courseCode),
        isRedeemed: "0",
        redeemedDate: "",
        redeemedBy: "",
        redeemedName: "",
        redeemedEmail: "",
        redeemedVia: "",
        redeemCode: ""
    };
};
async function generateVoucher(request, reply){
    try{
        const { digitalorEventCode, periodStartDate, classSession, coursePrice, voucherCount, uniqueChar, yrdt, courseCode } = request.body;
        let number = parseInt(request.body.voucherCount);
        let type=request.body.type;
        let crsCode=request.body.courseCode;
        if(type==='prakerja'){
            let uniqChar=request.body.uniqueChar;
            if(uniqChar>'5'){
                resp = {
                    "statuscode"    : 400,
                    "ack"           : 0,
                    "message"       : 'Unique Code will be 5'
                }
                reply.send(resp);
            }
        }
        if (!digitalorEventCode || !periodStartDate || !classSession || !crsCode || !coursePrice || !number) {
            resp = {
                "statuscode"    : 400,
                "ack"           : 0,
                "message"       : 'Missing required parameters'
            }
            reply.send(resp);
        }
        const vouchers = Array.from(
            {
                length: number
            }, () => createVoucherObject(
                digitalorEventCode, periodStartDate, classSession, coursePrice, uniqueChar, yrdt, courseCode
            )
        );
        resp = {
            "statuscode"    : 200,
            "ack"           : 1,
            "message"       : 'OK',
            "dataresult" : {
                "createDate": "",
                "createdBy": "",
                "creatorname": "",
                "creatoremail": "",
                "approvedDate": "",
                "approvedBy": "",
                "approverName": "",
                "approverEmail": "",
                "expiryDate": "",
                "vouchers": vouchers
            }
        }
        reply.send(resp);
    }catch(error){
        reply.status(500).send(error);
    }
}
module.exports = {getAllUsers,createUser,getUserById,deleteUser,updateUser,generateVoucher};