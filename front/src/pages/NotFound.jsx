import { Link } from 'react-router-dom'

function NotFound() {
    return (
        <div className={''} >
            <Link to={'/'}>   
                This page not foun din the database , plase go back to home
            </Link>
        </div>
    )
}


export default NotFound
