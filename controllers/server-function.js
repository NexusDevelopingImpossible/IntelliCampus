module.exports.checkurladmin = (req, res) => {
    if ((res.locals.user === undefined)) {
        return res.redirect('../')
    }
    if (!(res.locals.user.position === "admin")) {
        return res.redirect('../error')
    }
}
module.exports.checkurlteacher = (req, res) => {
    if ((res.locals.user === undefined)) {
        return res.redirect('../')
    }
    if (!(res.locals.user.position === "teacher")) {
        return res.redirect('../error')
    }
}
module.exports.checkurlstudent = (req, res) => {
    if ((res.locals.user === undefined)) {
        return res.redirect('../')
    }
    if (!(res.locals.user.position === "student")) {
        return res.redirect('../error')
    }
}
module.exports.checkurlexamcell = (req, res) => {
    if ((res.locals.user === undefined)) {
        return res.redirect('../')
    }
    if (!(res.locals.user.position === "examcell")) {
        return res.redirect('../error')
    }
}



