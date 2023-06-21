const User = require('../models/user');
const Admin = require('../models/admin');
const checkurlfunct = require('./server-function')

module.exports.home = function (req, res) {
    return res.redirect('/Login');
}

module.exports.Login = function (req, res) {
    return res.render('login-signup/Login', {
        title: "Login"
    });
}
module.exports.error = function (req, res) {
    return res.render('components/error404', {
        title: "error"
    });
}

module.exports.signUp = (req, res) => {
    return res.render('login-signup/signup', {
        title: "Sign Up"
    })
}

module.exports.temp = (req, res) => {
    return res.render('tempView', {
        title: "Test"
    })
}

module.exports.create = async (req, res) => {
    try {
        if (req.body.password != req.body.confirm_password) {
            return res.redirect('back');
        }
        let user = await User.findOne({ username: req.body.username })
        await User.create(req.body);
        await Admin.create(req.body);
        return res.redirect('/Login');
    }
    catch (err) {
        console.log(err);
    }
};

module.exports.createSession = (req, res) => {
    const { username, password } = req.body
    
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
            return res.redirect('/student/dashboard');
        } else if (user.position === 'teacher') {
            return res.redirect('/teacher/dashboard');
        } else if (user.position === 'admin') {
            return res.redirect('/admin/dashboard');
        } else {
            return res.redirect('login-signup/signup');
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