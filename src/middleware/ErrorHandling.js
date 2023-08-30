// Error handling middleware to be implemented with user signup section

// Checks and creates a request.body.errors array
// const errorsArray = (request, response, next) => {
//     if (!request.body.errors) {
//         request.body.errors = []
//     }
//     next();
// }

// // Checks length of request.body.errors,
// // if more than zero passes to error handler in server
// // else continues to route function.
// const errorsLength = (request, response, next) => {
//     if (request.body.errors.length > 0){
//         next(new Error(request.body.errors));
//     } else {
//         next();
//     }
// }

// module.exports = {
//     errorsArray,
//     errorsLength
// }