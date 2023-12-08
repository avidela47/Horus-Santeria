import mongoose from "mongoose";
// eslint-disable-next-line no-unused-vars
import colors from "colors";

mongoose.set('strictQuery', false);
const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Connected to MongoDB DataBase ${conn.connection.host}`.bgBlue.white
    );
  } catch (error) {
    console.log(`Error en MongoDb ${error.message}`.bgRed.white);
  }
};

export default connectDb;
