const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jsonWebToken = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    id: {
        type: String,
        maxLength: 12,
        unique: 1
    },
    password: {
        type: String,
        minLength: 8
    },
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

//디비에 넣기전에 비밀번호는 암호화해줌
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {

        try {
            //비밀번호 암호화
            const salt = await bcrypt.genSalt(saltRounds)
            this.password = await bcrypt.hash(this.password, salt)
            next()

        } catch (e) {
            next(e)
        }

    } else {
        next()
    }

})

//비밀번호 비교
userSchema.methods.comparePassword = async function (plainPassword) {

    //입력한 비밀번호의 암호화값과 암호화된 비밀번호를 비교함
    try {
        return await bcrypt.compare(plainPassword, this.password)
    } catch (e) {
        return e
    }

}


//토큰 생성
userSchema.methods.generateToken = async function () {

    const user = this

    //토큰 생성한후 토큰을 넣어줌
    user.token = jsonWebToken.sign(user._id.toHexString(), 'secretToken')

    //디비에 저장한 후 user를 리턴해줌
    try {
        await user.save()
        return user
    } catch (e) {
        return e
    }

}

//해당된 토큰을 가지고 있는 유저 찾기
userSchema.statics.findByToken = async function (token) {

    const user = this

    try {
        const decodedToken = await jsonWebToken.verify(token, 'secretToken')
        return user.findOne({"_id": decodedToken, "token": token})
    } catch (e) {
        return e
    }
}

const User = mongoose.model('user', userSchema)
module.exports = {User}