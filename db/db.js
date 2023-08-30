import mongoose from "mongoose";

const connectDb = async () => {
  if (mongoose.connections[0].readyState) return; // Already connected

  // Connection string
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  console.log(`Connected to ${db.connection.name}`);
};

export default connectDb;
