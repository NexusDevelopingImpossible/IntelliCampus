const checkurlfunct = require('./server-function');
module.exports.dashboard=(req,res)=>{
    checkurlfunct.checkurl(req,res);
    return res.render('teacherTemplate',{
        title:"Test"
    })
}