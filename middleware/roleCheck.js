exports.roleCheck = (...roles) => {
    // console.log(...roles)
    return async (req, res, next) => {
        try {
            // console.log(req.user)
            if (!roles.includes(req.user.profession[0].name)) {
                return res.status(403).json({
                    status: 403,
                    message: 'You does not have permission to perform this task!'
                })
            }
            next()
        } catch (error) {
            res.status(400).json({
                status: 400,
                message: error.message
            })
        }
    }
}