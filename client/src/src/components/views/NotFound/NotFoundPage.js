import React from "react"

function NotFoundPage() {

    return (
        <div className={"mainContainer"}>
            <h1 className={"title"}>404</h1>
            <p className={"contents"}>찾을 수 없는 페이지 입니다.</p>
            <p className={"contents"}>요청하신 페이지가 사려졌거나, 잘못된 경로를 요청하셨습니다:(</p>
        </div>
    )
}

export default NotFoundPage