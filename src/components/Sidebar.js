import {NavLink} from "react-router-dom";
import { FaHouse, FaCartShopping, FaHandHoldingDollar} from "react-icons/fa6";

const Sidebar = () => {
    return (
        <div className="sidebar bg-light">
            <ul className="nav">
                <li className="nav-item rubik-400">
                    <NavLink to="/" className="text-dark rounded py-2 w-100 d-inline-block px-4" activeClassName="active">
                        <FaHouse className="me-2"/>Inicio
                    </NavLink>
                </li>
                <li className="nav-item rubik-400">
                    <NavLink to="/sales" className="text-dark rounded py-2 w-100 d-inline-block px-2" activeClassName="active">
                        <FaCartShopping className="me-2"/>Comprar
                    </NavLink>
                </li>
                <li className="nav-item rubik-400">
                    <NavLink to="/clients" className="text-dark rounded py-2 w-100 d-inline-block px-1" activeClassName="active">
                        <FaHandHoldingDollar className="me-2" />Mis Compras
                    </NavLink>
                </li>
            </ul>
        </div>
    )
}
export default Sidebar