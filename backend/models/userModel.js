import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    description: {
      type: String,
    },
    role: {
      type: String,
      enum: ["educator", "student"],
      required: true,
    },
    photoUrl: {
      type: String,
      default: "",
    },
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    resetOtp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    isOtpVerifed: {
      type: Boolean,
      default: false,
    },

    interests: { type: [String], default: [] },
    skills: { type: [String], default: [] },
      preferredFields: { type: [String], default: [] },
    socialLinks: {
      linkedin: { type: String, default: null },
      github: { type: String, default: null },
      twitter: { type: String, default: null },
      personalWebsite: { type: String, default: null },
    },
    
    // Usage / Stress Tracking Fields
currentSessionStart: {
  type: Date,
  default: null,
},
dailyUsage: [
  {
    date: {
      type: String, 
    },
    minutesSpent: {
      type: Number,
      default: 0,
    },
  },
],
continuousUsageMinutes: {
  type: Number,
  default: 0,
},
    // Gamification Fields
    xp: { type: Number, default: 0 },
    rank: { type: String, default: "Novice" },
    completedLectures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }],

  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;