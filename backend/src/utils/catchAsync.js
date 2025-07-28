/**
 * Wraps an async function to catch errors and pass them to Express's error handler
 * @param {Function} fn - The async function to wrap
 * @returns {Function} - A middleware function that handles errors
 */
module.exports = (fn) => {
  return (req, res, next) => {
    // Resolve the promise returned by the async function
    // If it rejects (throws an error), catch it and pass to Express's error handler
    fn(req, res, next).catch(next);
    
    // Equivalent to:
    // fn(req, res, next).catch(err => next(err));
  };
};