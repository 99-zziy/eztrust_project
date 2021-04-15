import React, {useEffect} from "react"
import {useDispatch} from "react-redux"
import {auth} from "../actions/userAction"


export function withAuthCheck(Component, option) {

    // option:
    // null-> 아무나 출입이 가능
    // true-> 로그인한 유저만 출입이 가능
    // false-> 로그인한 유저는 출입이 불가

    return function (props) {

        const dispatch = useDispatch()

        useEffect(async () => {

            const response = await dispatch(auth())

            //로그인 하지않은 상태인데 로그인 한 유저만 출입이 가능한 페이지이면 로그인 페이지
            if ((!response.payload.isAuth) && (option)) return props.history.push('/login')

            //로그인 한 상태이고 로그인 한 유저는 출입불가 한 페이지이면 랜딩페이지
            if ((response.payload.isAuth) && (!option)) return props.history.push('/')

        }, []) //처음에만 호출

        return (
            <Component {...props}/>
        )

    }
}

