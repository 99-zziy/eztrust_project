import React from "react"
import {Link} from "react-router-dom"

function NavBar() {
    return (
        <nav>
            <ul className={"navContainer"}>
                <li className={"navItem"}><Link to="/">Home</Link></li>
                <li className={"navItem"}><Link to="/login">Login</Link></li>
                <li className={"navItem"}><Link to="/sign_up">Sign Up</Link></li>
            </ul>
        </nav>
    )
}

export default NavBar