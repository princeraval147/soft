import React from 'react'
import { NavLink } from 'react-router-dom'

const Error = () => {
    return (
        <>
            <h1>404 ! Page Not Found</h1>
            <NavLink to='/'>Go To Home Page</NavLink>
        </>
    )
}

export default Error
