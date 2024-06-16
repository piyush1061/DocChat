import mongoose from "mongoose";

const Connection = async (
  
) => {
  const URL = "mongodb+srv://piyushshukla74955:admin@piyushcluster2.mz7ayd2.mongodb.net/ChatandDoc?retryWrites=true&w=majority";
  try {
    await mongoose.connect(URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Error while connecting with the database ", error);
  }
};

export default Connection;
