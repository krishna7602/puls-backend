import mongoose from "mongoose";



const connectDB = async () =>{
    try {
       const connection =  await mongoose.connect(`${process.env.MONODB_URI}/${process.env.DB_NAME}`)
       console.log(`mongoDB succesfully Connected ${connection.connection.host}`)
    } catch (error) {
        console.log(`mongoDB connection failed ${error}`)
        process.exit(1);
    }
}


export default connectDB