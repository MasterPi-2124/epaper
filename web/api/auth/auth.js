const jwt = require("jsonwebtoken");
const accountService = require("../services/AccountService");

module.exports = async (request, response, next) => {
  try {
    //   get the token from the authorization header
    const token = await request.headers.authorization.split(" ")[1];

    //check if the token matches the supposed origin
    const decodedToken = await jwt.verify(token, accountService.secretKey);

    // retrieve the account details of the logged in account
    const account = await decodedToken;

    // pass the account down to the endpoints here
    request.account = account;
    // console.log(request.account);
    // =>
    // {
    //   accountId: 
    //   accountEmail: 
    //   iat: 
    //   exp: 
    // }

    // pass down functionality to the endpoint
    next();
    
  } catch (error) {
    response.status(401).json({
      // error: new Error("Invalid request!"),
      error: "Invalid request!"
    });
  }
};