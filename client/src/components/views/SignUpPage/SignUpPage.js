import React, {useState} from "react"
import {useDispatch} from "react-redux"
import {signUpUser} from "../../../actions/userAction"
import {withRouter} from "react-router-dom"
import {checkDuplicateId} from "../../../actions/userAction"

function SignUpPage(props) {

    const dispatch = useDispatch()

    const [id, setId] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [idCheckMSg, setIdCheckMsg] = useState("")
    const [pwdCheckMsg, setPwdCheckMsg] = useState("")
    const [confirmPwdCheckMsg, setConfirmPwdCheckMsg] = useState("")
    const [signUpMsg, setSignUpMsg] = useState("")

    const onIdHandler = async (event) => {
        setId(event.currentTarget.value)
        if (event.currentTarget.value === "") {
            setIdCheckMsg("아이디를 입력해주세요 :(")
        }
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)
        if (event.currentTarget.value === "") {
            setPwdCheckMsg("비밀번호를 입력해주세요 :(")
        }

    }

    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value)
        if (event.currentTarget.value === "") {
            setConfirmPwdCheckMsg("재확인 비밀번호를 입력해주세요 :(")
        }
    }

    //아이디 중복체크
    const checkId = async () => {

        let body = {
            id: id
        }

        try {
            const response = await dispatch(checkDuplicateId(body))
            console.log(`아이디 중복체크 결과: ${response.payload.isDuplicate}`)
            return response.payload.isDuplicate
        } catch (e) {

            console.log(`아이디 중복체크 에러 status: ${e.response.status} 에러 메시지: ${e.response.data.errorMsg}`)
            if (e.response.status === 409) {
                setIdCheckMsg("중복된 아이디 입니다 :(")
                return true
            }
            if (e.response.status === 400) {
                setIdCheckMsg("잘못된 요청입니다 :(")
                return true
            }
            if (e.response.status === 500) {
                setIdCheckMsg("서버에러가 발생했습니다. 잠시후에 다시 시도해주세요 :(")
                return true
            }

            //409 (중복된 아이디) ,500(서버 내부에러) ,400 (클라이언트 에러)가 아닌 경우
            setIdCheckMsg("예상치 못한 에러가 발생했습니다. :(")
            return true
        }

    }

    //아이디 정규표현식 검사
    const checkIdRegExp = () => {

        const idRegExp = /^[a-z0-9]{4,12}$/
        return idRegExp.test(id)

    }

    //아이디를 입력하다가 다른곳으로 이동시에 아이디 형식 체크 , 중복체크 하기
    const onCheckIdHandler = async (event) => {

        if (id === "") return setIdCheckMsg("아이디를 입력해주세요 :(")

        //아이디 형식 검사
        const isCheckId = checkIdRegExp()
        console.log(`id 유효성 검사 : ${isCheckId}`)
        if (!isCheckId) return setIdCheckMsg("아이디는 숫자와 영문자 조합으로 4~12자리를 사용해야 합니다 :(")

        //아이디 중복체크
        try {
            const isDuplicate = await checkId()
            if (!isDuplicate) return setIdCheckMsg("")
        } catch (e) {
            console.log(`아이디 중복체크 에러 status: ${e}`)
        }
    }


    //비밀번호 정규표현식 검사
    const checkPasswordRegExp = () => {

        const passwordEngNum = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$/.test(password)   //영문,숫자
        const passwordEngSpe = /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,20}$/.test(password)  //영문,특수문자
        const passwordSpeNum = /^(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{8,20}$/.test(password)  //특수문자, 숫자

        if (!(passwordEngNum || passwordEngSpe || passwordSpeNum)) {
            setPwdCheckMsg("비밀번호는 8~20자 이어야하고, [숫자,영문자,특수문자] 중에 2개이상 사용해야합니다 :(")
            return false
        }
        if (/(\w)\1\1\1/.test(password)) {
            setPwdCheckMsg("비밀번호에 같은 문자를 4번 이상 사용하실 수 없습니다 :(")
            return false
        }

        setPwdCheckMsg("")
        return true
    }

    //비밀번호를 입력하다가 다른곳으로 이동시에 비밀번호 형식 체크
    const onCheckPwdHandler = (event) => {

        if (password === "") return setPwdCheckMsg("비밀번호를 입력해주세요 :(")

        const isCheckPassword = checkPasswordRegExp()
        console.log(`password 유효성 검사 : ${isCheckPassword}`)
        if (isCheckPassword) setPwdCheckMsg("")

    }

    //재확인비밀번호를 입력하다가 다른곳으로 이동시에 재확인비밀번호 체크
    const onCheckConfirmPwdHandler = (event) => {

        if (confirmPassword === "") return setConfirmPwdCheckMsg("재확인 비밀번호를 입력해주세요 :(")

        if (password !== confirmPassword) {
            return setConfirmPwdCheckMsg("비밀번호와 재확인 비밀번호이 같아야 합니다 :(")
        }
        return setConfirmPwdCheckMsg("")
    }

    const onSubmitHandler = async (event) => {

        //preventDefault()를 안해주게 되면 페이지가 새로고침 됨
        event.preventDefault()

        if (id === "") return setIdCheckMsg("아이디를 입력해주세요 :(")
        if (password === "") return setPwdCheckMsg("비밀번호를 입력해주세요 :(")
        if (confirmPassword === "") return setConfirmPwdCheckMsg("재확인 비밀번호를 입력해주세요 :(")

        //에러메시지가 하나라도 있으면 회원가입 못하도록 리턴 시켜줌
        if ((idCheckMSg !== "") || (pwdCheckMsg !== "") || (confirmPwdCheckMsg !== "")) return

        let body = {
            id: id,
            password: password
        }

        try {
            const response = await dispatch(signUpUser(body))
            console.log(`회원가입 결과: ${response.payload.signupSuccess}`)

            if (response.payload.signupSuccess) {
                //회원가입이 완료되면 로그인 페이지로 이동
                setSignUpMsg("")
                props.history.push('/login')
            }

        } catch (e) {

            console.log(`회원가입 에러 status: ${e.response.status} 에러 메시지: ${e.response.data.errorMsg}`)
            if (e.response.status === 500) {
                setSignUpMsg("서버에러가 발생하여 하여 회원가입에 실패했습니다. 잠시후에 다시 시도해주세요 :(")
            }
            if (e.response.status === 400) {
                setSignUpMsg("잘못된 요청입니다 :(")
            }
            //500(서버 내부에러) , 400(클라이언트 에러)가 아닌 경우
            setSignUpMsg("예상치 못한 에러가 발생하여 회원가입에 실패했습니다 :(")
        }

    }

    return (
        <div className={"mainContainer signUpContainer"}>
            <form onSubmit={onSubmitHandler}>
                <p className={"formTitle"}>SIGN UP</p>
                <label>Id</label>
                <input type="id" value={id} onChange={onIdHandler} onBlur={onCheckIdHandler}/>
                <p className={"errorMessage"}>{idCheckMSg}</p>
                <label>Password</label>
                <input type="password" value={password} onChange={onPasswordHandler} onBlur={onCheckPwdHandler}/>
                <p className={"errorMessage"}>{pwdCheckMsg}</p>
                <label>Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={onConfirmPasswordHandler}
                       onBlur={onCheckConfirmPwdHandler}/>
                <p className={"errorMessage"}>{confirmPwdCheckMsg}</p>
                <button className={"loginButton"}>
                    Sign Up
                </button>
                <p className={"errorMessage"}>{signUpMsg}</p>
            </form>
        </div>
    )
}

export default withRouter(SignUpPage)