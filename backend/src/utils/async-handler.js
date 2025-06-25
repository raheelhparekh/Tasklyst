const asyncHandler = (requestHandler) => {
  // return function() line 13 down there
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)
    .catch((err) => next(err)));
  };
};

export { asyncHandler };

// the returned function is written down which is the same done as above

// function test(req,res,next){
//   Promise.resolve(()=>{})
//   .catch()
// }