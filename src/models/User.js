const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "Please provide first name"],
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, "Please provide last name"],
      trim: true,
    },
    phone_number: {
      type: String,
      required: [true, "Please provide phone number"],
      trim: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v); // Example for 10-digit phone number
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter an password"],
      minlength: [6, "Minimum password length is 6 characters"],
    },
  },
  {
    timestamps: true,
  }
);

//fire before saving to DB
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login
userSchema.static.login = async function (email, password) {
  const user = await this.User.findOne({ email });

  if (user) {
    const auth = bcrypt.compare(password, this.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

const User = mongoose.model("User", userSchema);

module.exports = User;
