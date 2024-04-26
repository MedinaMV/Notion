import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function AdminNavBar() {
    const navigation = useNavigate();
    function logout(){
        document.cookie.split(';').forEach(function (c) {
            document.cookie = c.trim().split('=')[0] + '=;' + 'expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        });
        navigation(0);
    }
    return (
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <Link class="navbar-brand" to="/admin">Admin Panel</Link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
            </div>
            <span class="navbar-text" style={{marginRight: '20px', cursor: 'pointer', color: 'white'}} onClick={logout}>
                Logout
            </span>

        </nav>
    );
}