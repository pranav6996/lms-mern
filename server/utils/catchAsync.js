/**
 * Wraps async controller functions to automatically catch errors
 * and forward them to the centralized error handler.
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
