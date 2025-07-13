import ThemeToggler from "../ThemeToogler";


const Navbar = () => {
    return (
        <div className="navbar bg-base-200 shadow-md px-4">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl" href="/">NEXHACK</a>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li><a href="/">Inicio</a></li>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                </ul>
            </div>
            <div><ThemeToggler/></div>
        </div>
    );
};

export default Navbar;
