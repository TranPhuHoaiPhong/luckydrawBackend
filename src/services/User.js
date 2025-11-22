import { genneralAccessToken, genneralRefreshToken } from "../JwtService/JwtService.js"
import User from "../models/User.js"
import bcrypt from "bcrypt"

class UserService {
    async createUser(data) {
        const existingUser = await User.findOne({ email: data.email})
        if(existingUser) {
            const error = new Error("Email adready exists")
            error.code = 400
            throw error
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const newUser = new User({
            fullName: data.fullName,
            email: data.email,
            password: hashedPassword,
            role: data.role || "player",
            avatarUrl: data.avatarUrl || "",
            spinsLeft: data.spinsLeft || 1,
        });

        const savedUser = await newUser.save()

        return {
            message: "User created successfully",
            user: savedUser
        }
    }

    async getAllUsers() {
        const users = await User.find().select("-password")
        return {
            message: "User created successfully",
            users
        }
    }

    async getUserById(id) {
        const user = await User.findById(id).select("-password")

        if( !user) {
            const error = new Error("Tài khoản không tồn tại")
            error.code = 400
            throw error
        }

        return {
            message: "User fetched successfully",
            user
        }
    }

    async updateUser(id, data) {
        const updateData = {...data}

        if( data.password) {
            updateData.password = await bcrypt.hash(data.password, 10)
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password")

        if( !updatedUser) {
            const error = new Error("User not found")
            error.code = 400
            throw error
        }

        return {
            message: "User updated successfully",
            user: updatedUser
        }
    }

    async deleteUser(id) {
        const deleted = await User.findByIdAndDelete(id).select("-password")

        if( !deleted) {
            const error = new Error("User not found")
            error.code = 400
            throw error
        }

        return {
            message: "User deleted successfully",
            user: deleted
        }
    }

    async login({ email, password}) {
      const user = await User.findOne({ email: email });

      // Nếu không tồn tại user
      if (!user) {
        const error = new Error("Email not found")
        error.code = 400
        throw error
      }

      const isMatch = bcrypt.compareSync(password, user.password)
      if( !isMatch) {
        const error = new Error("Password not the same")
        error.code = 400
        throw error
      }

      const access_Token = genneralAccessToken({
        id: user._id,
        role: user.role
      })

      const refresh_Token = genneralRefreshToken({
        id: user._id,
        role: user.role,
      })
      
      return {
        user: {
            id: user._id,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
        },
        access_Token,
        refresh_Token,
    };
    }
}

export default new UserService