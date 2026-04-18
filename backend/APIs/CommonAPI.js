import exp from 'express'
import bcrypt from 'bcryptjs'
import { authenticate } from '../services/authService.js';
import { UserTypeModel } from '../models/UserTypeModel.js';
import { verifyToken } from "../middlewares/verifyToken.js";

export const commonRouter = exp.Router()

// login
commonRouter.post('/login', async (req, res) => {
  try {
    let userCred = req.body;
    let { token, user } = await authenticate(userCred);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({ message: "login success", payload: user });

  } catch (err) {
    // If authenticate() throws a known error (wrong password/email),
    // send 401 with the message. Otherwise send generic 500.
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    res.status(status).json({ message });
  }
})

// logout
commonRouter.get('/logout', async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  res.status(200).json({ message: "Logged out successfully" });
})

// change password
commonRouter.put('/change-password', verifyToken("ADMIN", "AUTHOR", "USER"), async (req, res) => {
  try {
    const { role, email, currentPassword, newPassword } = req.body;

    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from current password" });
    }

    const account = await UserTypeModel.findOne({ email });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (account._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: "You can only change your own password" });
    }

    const isMatch = await bcrypt.compare(currentPassword, account.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    account.password = await bcrypt.hash(newPassword, 10);
    await account.save();

    res.status(200).json({ message: "Password changed successfully" });

  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
    commonRouter.get("/check-auth", verifyToken("USER", "AUTHOR", "ADMIN"), (req, res) => {
        res.status(200).json({
            message: "authenticated",
            payload: req.user
        });
    });

});
