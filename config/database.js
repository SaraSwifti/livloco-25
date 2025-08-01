import mongoose from "mongoose";

let connected = false;

const connectDB = async () => {

    ///this was suggested to add however did not solve the problem.
//     mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
    //only fields specified are saved to the database with strictQuery
    mongoose.set('strictQuery', true);

    //if the database is already connected, don't connect again
    if (connected) {
        console.log('MongoDB is connected');
        return;
    }
    //connect to MongoDB
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        connected = true;
    } catch (error) {
        console.log(error);
    }
};

export default connectDB;