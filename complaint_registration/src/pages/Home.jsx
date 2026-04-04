import { NavLink } from "react-router-dom"

function Home() {
    return (
        <div>
<h1> Hello world</h1>
        <nav>
            <NavLink to ="/login">Login</NavLink>
            <NavLink to ="/register">Register</NavLink>
        </nav>
        <p>This is the System that allow you to submit your compliaints that you are facing in the daily life</p>
        </div>
    )
}

export default Home
