const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://prosnitasaha_db_user:Prosnita@cluster0.yrfwt7o.mongodb.net/?appName=Cluster0"
        );

        console.log("MongoDB Connected");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDB;