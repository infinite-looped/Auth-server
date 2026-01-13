// Starts HTTP server and handles shutdown
const app = require("./app"); 
const { env } = require("./config/env.config"); 
const { connectDB } = require("./config/db.config"); 


const startServer = async () => {
    // Connect to Database
    await connectDB();

        const server = app.listen(env.port, () => {
            console.log(`Server is running on port ${env.port}`);
        });
        
        //  Shutdown 
        const shutdown = () => {
            console.log('Shutting down server...');
            server.close(() => {
                console.log('Server closed.');
                process.exit(0);
            });
        }
        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
      

        
   
};



startServer();
