const express = require('express')
const router = express.Router()
const {auth} = require('../middleware/auth')
const {User} = require("../models/user")
const bodyParser = require('body-parser')
const cookieParer = require("cookie-parser")

//application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({extended: true}))

//application/json
router.use(bodyParser.json())
router.use(cookieParer())


//아이디 중복체크
router.post('/id_check', async (req, res) => {


    if (req.body.id === undefined || req.body.id === "") {
        return res.status(400).json({isDuplicate: false, errorMsg: "잘못된 요청입니다."})
    }

    try {
        const userInfo = await User.findOne({id: req.body.id})

        //중복된 아이디가 있음
        if (userInfo) return res.status(409).json({isDuplicate: true, errorMsg: "중복된 아이디입니다."})
        //중복된 아이디가 없음
        return res.status(200).json({isDuplicate: false})
    } catch (e) {
        //에러가 발생해 id 중복체크를 못함
        return res.status(500).json({isDuplicate: true, errorMsg: "서버 에러가 발생했습니다."})
    }
})


router.post('/sign_up', async (req, res) => {


    if (req.body.id === undefined || req.body.id === "") {
        return res.status(400).json({signupSuccess: false, errorMsg: "잘못된 요청입니다."})
    }

    if (req.body.password === undefined || req.body.password === "") {
        return res.status(400).json({signupSuccess: false, errorMsg: "잘못된 요청입니다."})
    }

    //회원가입 할 때 필요한 정보들을 클라에서 가져오면 데이터베이스에 넣어준다. (id와 Password)
    const user = new User(req.body)

    try {
        const success = await user.save()
        console.log(`회원가입 성공 ${success}`)
        if (success) return res.status(200).json({signupSuccess: true})
    } catch (e) {

        //에러가 발생해 회원가입에 실패함
        console.log(`회원가입 에러 ${e}`)
        return res.status(500).json({signupSuccess: false, errorMsg: "서버 에러가 발생했습니다."})
    }

})

//로그인 요청
router.post('/login', async (req, res) => {

    if (req.body.id === undefined || req.body.id === "") {
        return res.status(400).json({loginSuccess: false, errorMsg: "잘못된 요청입니다."})
    }

    if (req.body.password === undefined || req.body.password === "") {
        return res.status(400).json({loginSuccess: false, errorMsg: "잘못된 요청입니다."})
    }

    try {

        //아이디가 디비에 있는지 조회한 후 없으면 로그인 실패
        const userInfo = await User.findOne({id: req.body.id})
        if (!userInfo) return res.status(401).json({loginSuccess: false, errorMsg: "가입한 회원이 아닙니다."})

        //입력한 비밀번호와 해당하는 아이디의 비밀번호 비교한 후 안맞으면 로그인 실패
        const isMatch = await userInfo.comparePassword(req.body.password)
        if (!isMatch) return res.status(401).json({loginSuccess: false, errorMsg: "비밀번호가 맞지않습니다."})

        //로그인을 성공하면 토큰을 생성한 후에 쿠키에 토큰을 저장함
        const user = await userInfo.generateToken()
        if (user) {
            res.cookie("x_auth", user.token)
                .status(200)
                .json({loginSuccess: true})
        }

    } catch (e) {

        //에러가 발생해 로그인에 실패함
        console.log(`로그인 에러 ${e}`)
        return res.status(500).json({loginSuccess: false, errorMsg: "서버 에러가 발생했습니다."})
    }

})

//로그아웃
router.get('/logout', auth, async (req, res) => {

    try {
        //토큰을 지워줌
        const success = await User.findOneAndUpdate({_id: req.user._id}, {token: ""})
        if (success) {
            console.log(`로그아웃 성공 ${success}`)
            return res.status(200).json({logoutSuccess: true})
        }

    } catch (e) {

        //에러가 발생해 로그아웃에 실패함
        console.log(`로그아웃 에러 ${e}`)
        return res.status(500).json({logoutSuccess: false, errorMsg: "서버 에러가 발생했습니다."})
    }
})

//로그인 했는지 확인
router.get('/auth', auth, (req, res) => {

    //미들웨어를 성공했다면
    res.status(200).json({
        isAuth: true
    })

})

module.exports = router