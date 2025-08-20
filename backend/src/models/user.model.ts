import { Document, model, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  roles: "super-admin" | "admin" | "user";
  native: string;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: {
      type: String,
      required: true,
      enum: ["super-admin", "admin", "user"],
      default: "user",
    },
    native: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (_doc, ret: Record<string, any>) => {
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      transform: (_doc, ret: Record<string, any>) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

const User = model<IUser>("User", userSchema);

export default User;
