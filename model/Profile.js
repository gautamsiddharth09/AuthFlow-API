const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    mobile: {
      type: String,
      minlength: 10,
      maxlength: 10,
    },

    dateOfBirth: {
      type: date,
    },
    gender: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      maxlength: 100,
      minlength: 5,
    },
  },
  { timestamps: true },
);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
