import jwt from "jsonwebtoken";

export const verifyToken = (...allowedRoles) => {
  return (req, res, next) => {
    try {

      // get token from cookies
      let signedToken = req.cookies.token;

      if (!signedToken) {
        return res.status(401).json({
          message: "Unauthorized request. Please login first"
        });
      }

      // verify token
      const decodedToken = jwt.verify(signedToken, process.env.JWT_SECRET);

      // role check
      if (allowedRoles.length && !allowedRoles.includes(decodedToken.role)) {
        return res.status(403).json({
          message: "Forbidden request. You don't have access to this resource"
        });
      }

      // attach user
      req.user = decodedToken;

      next();

    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Session expired. Please login again"
        });
      }

      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          message: "Invalid token. Please login again"
        });
      }

      next(err);
    }
  };
};