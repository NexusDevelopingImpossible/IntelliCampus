module.exports.home = function(req, res){
    return res.redirect('/users/Login');
    // return res.render('Login', {
    //     title: "Login"
    // });
}
