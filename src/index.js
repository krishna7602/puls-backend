import { app } from "./server.js";
import 'dotenv/config'
import connectDB from "./db/index.js";




const PORT = process.env.PORT || 3000;

connectDB().
then(()=>{
    app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    })
}).catch((err)=>{
    console.log(err);
})
    
