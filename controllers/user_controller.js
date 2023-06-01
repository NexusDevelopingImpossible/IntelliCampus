const User = require('../models/user');

module.exports.Login = function(req, res){
    return res.render('Login', {
        title: "Login"
    });
}

module.exports.signUp=(req,res)=>{
    return res.render('signup',{
        title:"Sign Up"
    })
}

module.exports.temp=(req,res)=>{
    return res.render('tempView',{
        title:"Test"
    })
}

module.exports.student=(req,res)=>{
    return res.render('student',{
        title:"Test"
    })
}

module.exports.teacher=(req,res)=>{
    return res.render('teacher',{
        title:"Test"
    })
}

module.exports.admin=(req,res)=>{
    return res.render('admin',{
        title:"Test"
    })
}

module.exports.create = (req, res) => {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }
    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) { console.log('error in finding user'); return; }
        if (!user) {
            User.create(req.body, (err, user) => {
                if (err) { console.log('error in finding user ' ,err); return; }

                res.redirect('/users/Login');
            });
        }
        else {
            res.redirect('back');
        }
    });
};



module.exports.createSession = (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    // Find the user in the database based on the provided username
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            console.log('Error:', err);
            return res.redirect('/');
        }

        if (!user || user.password !== password) {
            // User not found or password is incorrect
            return res.redirect('/');
        }
        // Redirect to different routes based on the user's type
        if (user.position === 'student') {
            return res.redirect('/users/student');
        } else if (user.position === 'teacher') {
            return res.redirect('/users/teacher');
        } else if (user.position === 'admin') {
            return res.redirect('/users/admin');
        } else {
            return res.redirect('/users/signup');
        }
    });
};


module.exports.destroySession = function (req, res) {
    // logout has been upgraded as an asynchronous function so it requires a callback function to handle error now
    req.logout(function (error) {
      if (error) {
        return next(error);
      }
      return res.redirect("/");
    });
  };
