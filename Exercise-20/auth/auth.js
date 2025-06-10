exports.isAuthenticated = async (req, res, next) => { 
try { 
console.log('o day'); 
if (req.cookies.username) { 
console.log('o day 22'); 
next(); // User is authenticated, proceed to the next middleware 
} else { 
// Instead of automatically redirecting, we inform the client that authentication is required 
/// The client should handle this response by redirecting the user to the login or signup page 
res.status(401).json({ 
message: 'You are not authenticated. Please login or signup.', 
nextSteps: { 
login: '/users/login', // Client can use this route to redirect to the login page 
signup: /users/signup // Client can use this route to redirect to the signup page 
}})}
} catch (error) { 
console.error(error); 
res.status(500).json({ message: error.message });
}
}