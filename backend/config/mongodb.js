import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // MongoDB connection options for better SSL/TLS handling
        const options = {
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4, // Use IPv4, skip trying IPv6
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            heartbeatFrequencyMS: 10000, // Send a ping every 10 seconds
        };

        // Establish connection
        await mongoose.connect(process.env.MONGO_URI, options)
        console.log('✔ Database Connected Successfully')
    } catch (error) {
        console.error("❌ Database connection failed: ", error.message)
        
        // If it's an SSL error, try with additional SSL options
        if (error.message.includes('SSL') || error.message.includes('TLS')) {
            console.log('🔄 Trying alternative connection method...')
            try {
                const altOptions = {
                    ...options,
                    ssl: true,
                    sslValidate: false, // Only for testing - should be true in production
                };
                await mongoose.connect(process.env.MONGO_URI, altOptions)
                console.log('✔ Database Connected with alternative SSL settings')
            } catch (altError) {
                console.error("❌ Alternative connection also failed:", altError.message)
            }
        }
    }
}

export default connectDB