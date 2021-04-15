import React, {useState} from "react"
import {withRouter} from "react-router-dom"
import {useDispatch} from "react-redux"
import {logoutUser} from "../../../actions/userAction"

function LandingPage(props) {

    const dispatch = useDispatch()
    const [logoutMsg, setLogoutMsg] = useState("")

    const onClickHandler = async () => {

        try {
            const response = await dispatch(logoutUser())
            console.log(`로그아웃 결과: ${response.payload.logoutSuccess} status: ${response.status}`)
            if (response.payload.logoutSuccess) {
                setLogoutMsg("")
                props.history.push('/login')
            }

        } catch (e) {

            console.log(`로그아웃 에러 status: ${e.response.status} 에러 메시지: ${e.response.data.errorMsg}`)
            if (e.response.status === 500) return setLogoutMsg("서버에러가 발생했습니다. 잠시후에 다시 시도해주세요 :(")

            //500(서버 내부에러)가 아닌 경우
            return setLogoutMsg("예상치 못한 에러가 발생했습니다. :(")
        }

    }

    return (
        <>
            <div className={"mainContainer"}>
                <button className={"logoutButton"} onClick={onClickHandler}>
                    로그아웃
                </button>
                <p className={"errorMessage"}>{logoutMsg}</p>
            </div>
            <div className={"mainContainer"}>
                <h2 className={"title"}>React를 이용하여 Sign Up & Login만 있는 앱 만들기</h2>
                <p className={"contents"}>수행 과정에서 염두할 키워드</p>
                <ul>
                    <li>React</li>
                    <li>JavaScript ES6</li>
                    <li>Async/Await</li>
                    <li>Redux Store</li>
                    <li>React Router</li>
                </ul>
                <p className={"contents"}>기한 : 4월 16일 오전 11시</p>
            </div>
        </>
    )
}

export default withRouter(LandingPage)