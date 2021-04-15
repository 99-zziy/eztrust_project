import React, {useState} from "react"
import {useDispatch} from "react-redux"
import {loginUser} from "../../../actions/userAction"
import {withRouter} from "react-router-dom"

function LoginPage(props) {

    const dispatch = useDispatch()

    //상태관리
    const [id, setId] = useState("")
    const [password, setPassword] = useState("")
    const [idErrorMsg, setIdErrorMsg] = useState("")
    const [passwordErrorMsg, setPasswordErrorMsg] = useState("")
    const [loginMsg, setLoginMsg] = useState("")

    const onIdHandler = (event) => {
        setId(event.currentTarget.value)

        if (event.currentTarget.value === "") {
            setLoginMsg("")
            return setIdErrorMsg("아이디를 입력해주세요 :(")
        }
        return setIdErrorMsg("")

    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value)

        if (event.currentTarget.value === "") {
            setLoginMsg("")
            return setPasswordErrorMsg("비밀번호를 입력해주세요 :(")
        }
        return setPasswordErrorMsg("")

    }

    const onSubmitHandler = async (event) => {

        //preventDefault()를 안해주게 되면 페이지가 새로고침 됨
        event.preventDefault()

        if (id === "") return setIdErrorMsg("아이디를 입력해주세요 :(")
        if (password === "") return setPasswordErrorMsg("비밀번호를 입력해주세요 :(")
        console.log(`로그인 id: ${id} password: ${password}`)

        let body = {
            id: id,
            password: password
        }

        try {
            const response = await dispatch(loginUser(body))
            console.log(`로그인 결과: ${response.payload.loginSuccess} status: ${response.status}`)

            //로그인 성공 -> 랜딩 페이지
            if (response.payload.loginSuccess) {
                setLoginMsg("")
                props.history.push('/')
            }

        } catch (e) {

            console.log(`로그인 에러 status: ${e.response.status} 에러 메시지: ${e.response.data.errorMsg}`)

            if (e.response.status === 401) return setLoginMsg("가입하지 않은 아이디이거나, 잘못된 비밀번호입니다 :(")
            if (e.response.status === 500) return setLoginMsg("서버에러가 발생했습니다. 잠시후에 다시 시도해주세요 :(")
            if (e.response.status === 400) return setLoginMsg("잘못된 요청입니다 :(")

            //401 (가입하지않거나 , 비밀번호 잘 못 입력 한 유저) ,500(서버 내부에러)가 아닌 경우 ,400 (클라이언트 에러)가 아닌 경우
            return setLoginMsg("예상치 못한 에러가 발생했습니다. :(")
        }

    }

    return (
        <div className={"mainContainer loginContainer"}>
            <form onSubmit={onSubmitHandler}>
                <p className={"formTitle"}>LOGIN</p>
                <label>Id</label>
                <input type="id" value={id} onChange={onIdHandler}/>
                <p className={"errorMessage"}>{idErrorMsg}</p>
                <label>Password</label>
                <input type="password" value={password} onChange={onPasswordHandler}/>
                <p className={"errorMessage"}>{passwordErrorMsg}</p>
                <button className={"loginButton"}>
                    Login
                </button>
                <p className={"errorMessage"}>{loginMsg}</p>
            </form>
        </div>
    )
}

export default withRouter(LoginPage)

