const {User} = require('../models/user')

//인증처리를 하는 곳
let auth = async (req, res, next) => {

    //클라이언트에 있는 쿠키에서 토큰을 가져옴
    let token = req.cookies.x_auth

    try {

        //토큰을 복호화한 후 유저를 찾는다
        const user = await User.findByToken(token)
        if (!user) return res.json({isAuth: false})

        //유저가 있으면
        req.user = user

        //미들웨어 이기때문에 다음으로 넘겨주기 위함
        next()

    } catch (e) {
        next(e)
    }

}

module.exports = {auth}