const Mastermenus = require("../models/mastermenus.model");
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);
async function getAllMenu(request, reply){
    //initial value
    var ack = 1;
    var msg = "";
    var statuscode = 200;
    var resp = "";
    try{
        var mastermenus=await Mastermenus.find();
        msg = "OK";
    }catch(error){
        console.log(error);
        statuscode = 500;
        ack = 0;
        msg = error;
    }
    resp = {
        "statuscode"    : statuscode,
        "ack"           : ack,
        "message"       : msg,
        "datares"       : mastermenus
    }
    reply.send(resp);
}
async function getAllMenuBySearch(request, reply){
    try{
        //initial value
        var ack = 1;
        var msg = "";
        var statuscode = 200;
        var resp = "";
        var searchTerm = request.body.searchdata;
        var charCount = searchTerm.length;
        if(charCount === 0 || charCount>10){
            ack = 0;
            msg = "Invalid parameters";
            var mastermenus = [];
        }else{
            var mastermenus=await Mastermenus.find({ $text: { $search: searchTerm } });
            msg = "OK";
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
        "message"       : msg,
        "datares"       : mastermenus
    }
    reply.send(resp);
}
async function getMenuByMenuCode(request, reply){
    try{
        var ack = 1;
        var msg = "";
        var statuscode = 200;
        var resp = "";
        var searchTerm = request.body.searchdata;
        var charCount = searchTerm.length;
        if(charCount === 0 || charCount>10){
            ack = 0;
            msg = "Invalid parameters";
            var menuitems = [];
        }else{
            var menuitems = await Mastermenus.aggregate([
                {$match: {
                        'm_menu.menucode': { $regex: searchTerm, $options: 'i' }
                    }
                },
                {$project: {
                    m_menu: {$filter: {
                        input: '$m_menu', as: 'm_menu',
                        cond:
                            {$regexMatch: {
                                // Use $regexMatch to compare case-insensitively
                                input: '$$m_menu.menucode',
                                regex: searchTerm,
                                options: 'i'
                            }}
                    }},
                    _id: 0
                }}
            ]);
            msg = "OK";
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
        "message"       : msg,
        "datares"       : menuitems
    }
    reply.send(resp);
}
async function getMenuByMenuName(request, reply){
    try{
        var ack = 1;
        var msg = "";
        var statuscode = 200;
        var resp = "";
        var searchTerm = request.body.searchdata;
        var charCount = searchTerm.length;
        if(charCount === 0){
            ack = 0;
            msg = "Invalid parameters";
            var menuitems = [];
        }else{
            let escapedSearchCode = searchTerm.replace(/\s+/g, '.*');
            var menuitems = await Mastermenus.aggregate([
                {$match: {
                        'm_menu.menuname': { $regex: escapedSearchCode, $options: 'i' }
                    }
                },
                {$project: {
                        m_menu: {$filter: {
                                input: '$m_menu', as: 'm_menu',
                                cond:
                                    {$regexMatch: {
                                            // Use $regexMatch to compare case-insensitively
                                            input: '$$m_menu.menuname',
                                            regex: escapedSearchCode,
                                            options: 'i'
                                        }}
                            }},
                        _id: 0
                    }}
            ]);
            msg = "OK";
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
        "message"       : msg,
        "datares"       : menuitems
    }
    reply.send(resp);
}
async function getMenuByGroupCode(request, reply){
    try{
        var ack = 1;
        var msg = "";
        var statuscode = 200;
        var resp = "";
        var searchCode = request.body.groupcode;
        var charCountCode = searchCode.length;
        if(charCountCode === 0 || charCountCode>10){
            ack = 0;
            msg = "Invalid parameters";
            var menuitems = [];
        }else{
            var menuitems = await Mastermenus.aggregate([
                {$match: {
                        'menugroupcode': { $regex: searchCode, $options: 'i' }
                    }
                }
            ]);
            if(menuitems!=''){
                var menuitems = menuitems;
                msg = "OK";
            }else{
                ack = 0;
                msg = "No Data Found";
                var menuitems = [];
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
        "message"       : msg,
        "datares"       : menuitems
    }
    reply.send(resp);
}
async function getMenuByGroupName(request, reply){
    try{
        var ack = 1;
        var msg = "";
        var statuscode = 200;
        var resp = "";
        var searchCode = request.body.groupname;
        var charCountCode = searchCode.length;
        if(charCountCode === 0){
            ack = 0;
            msg = "Invalid parameters";
            var menuitems = [];
        }else{
            let trimmedSearchCode = searchCode.trim();
            var menuitems = await Mastermenus.aggregate([
                {$match: {
                        'menugroupname': { $regex: trimmedSearchCode, $options: 'i' }
                    }
                }
            ]);
            if(menuitems!=''){
                var menuitems = menuitems;
                msg = "OK";
            }else{
                ack = 0;
                msg = "No Data Found";
                var menuitems = [];
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
        "message"       : msg,
        "datares"       : menuitems
    }
    reply.send(resp);
}
async function insertMenuGroup(request, reply){
    var ack = 1;
    var msg = "";
    var statuscode = 200;
    var resp = "";
    try{
        const mastermenus = new Mastermenus(request.body);
        const result = mastermenus.save();
        msg = "OK";
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
async function insertmenu(request, reply){
    var ack = 1;
    var msg = "";
    var statuscode = 200;
    var resp = "";
    let objctid = request.body.menugroupid;
    const newMenuItem = request.body.menudata;
    var msgDt = dayjs().tz("Asia/Jakarta").format();
    newMenuItem.createdate=msgDt;
    newMenuItem.lastupdatetime=msgDt;
    try {
        const result = await Mastermenus.updateOne(
            { _id: objctid },
            { $push: { m_menu: newMenuItem } }
        );
        msg = "OK";
    } catch (error) {
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
async function insertsubmenu(request, reply){
    var ack = 1;
    var msg = "";
    var statuscode = 200;
    var resp = "";
    let menugroupid = request.body.menugroupid;
    let submenuid = request.body.menuid;
    const newMenuItem = request.body.menudata;
    var msgDt = dayjs().tz("Asia/Jakarta").format();
    newMenuItem.createdate=msgDt;
    newMenuItem.lastupdatetime=msgDt;
    try {
        const result = await Mastermenus.findOneAndUpdate(
            { _id: menugroupid, 'm_menu._id': submenuid },  // Match with id's
            { $push: { 'm_menu.$.d_submenu': newMenuItem } },  // Push submenu into d_submenu
            { new: true }  // Return the updated document
        );
        msg = "OK";
    } catch (error) {
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
async function updatemenugroup(request, reply){
    var ack = 1;
    var msg = "";
    var statuscode = 200;
    var resp = "";
    try{
        let menuid = request.body.menugroupid;
        const menudata = request.body.menudata;
        var msgDt = dayjs().tz("Asia/Jakarta").format();
        menudata.lastupdatetime=msgDt;
        const result=await Mastermenus.findByIdAndUpdate(
            menuid, // Find the document by _id
            { $set: menudata },   // Update menudata fields
            { new: true }  );       // Return the updated document);
        msg = "OK";
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
async function updateMenu(request, reply){
    var ack = 1;
    var msg = "";
    var statuscode = 200;
    var resp = "";
    try{
        const menugroupid = request.body.menugroupid;
        const submenuid = request.body.menuid;
        const updateData = request.body.menudata;
        var msgDt = dayjs().tz("Asia/Jakarta").format();
        const updateFields = {
            "m_menu.$.lastupdatetime": msgDt
        };
        updateFields["m_menu.$.menuname"] = updateData.menuname;
        updateFields["m_menu.$.isactive"] = updateData.isactive;
        const result = await Mastermenus.updateOne(
            { _id: menugroupid, "m_menu._id": submenuid },
            { $set: updateFields }
        );
        if (result.modifiedCount > 0) {
            msg = "OK";
        } else {
            msg = "MenuGroup or Submenu not found";
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

module.exports = {
    getAllMenu,
    getAllMenuBySearch,
    getMenuByMenuCode,
    getMenuByMenuName,
    getMenuByGroupCode,
    getMenuByGroupName,
    insertMenuGroup,
    insertmenu,
    insertsubmenu,
    updatemenugroup,
    updateMenu
};