import jwt from 'jsonwebtoken'

export function authenticateToken(req, res, next) {
    // Get token from Authorization header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    // Check if token exists
    if (!token) {
        return res.status(401).json({ 
            message: "Access token required" 
        })
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN)
        
        // Add user info to request object for use in protected routes
        req.user = decoded
        
        // Continue to next middleware/route handler
        next()
        
    } catch (error) {
        // Handle different JWT errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: "Token expired" 
            })
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: "Invalid token" 
            })
        } else {
            console.error("Error in authenticateToken middleware:", error)
            return res.status(500).json({ 
                message: "Internal server error" 
            })
        }
    }
}