// Dependencies
const createError = require("http-errors"); 


// 404 not found handler
function notFoundHandler(req, res, next) {
    next(createError(404, "Your requested content was not found!"));
  }

// default error handler
function errorHandler(err, req, res, next) {

    if (res.locals?.html) {
        // Html response
        res.render('error',{
            title : "Error Page",
            error : process.env.NODE_ENV === 'development' ? err : { message : err.message},
            status : (err.status || 500)
        })
    }else{
        // Json response
        res.json(res.locals.error)
    }
}


module.exports = {
    notFoundHandler,
    errorHandler
}