import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from '../Styles/Header.module.css'

const Header = () => {
    return (
        <>
            <div className={styles.header}>
                <h1>Bhakti Gems</h1>
                <ul className={styles.links}>
                    <li>
                        <NavLink to='/'>Daily Stock</NavLink>
                    </li>
                    <li>
                        <NavLink to='/party'>Party Master</NavLink>
                    </li>
                    <li>
                        <NavLink to='/emp'>Emp Master</NavLink>
                    </li>
                    <li>
                        <NavLink to='/rough'>Rough</NavLink>
                    </li>
                    <li>
                        <NavLink to='/report'>Report</NavLink>
                    </li>
                </ul>
            </div >
        </>
    )
}

export default Header
