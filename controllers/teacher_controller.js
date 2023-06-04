const checkurlfunct = require('./server-function');
module.exports.dashboard=(req,res)=>{
    checkurlfunct.checkurlteacher(req,res);
    return res.render('teacherTemplate',{
        title:"Test"
    })
}