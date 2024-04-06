import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
    const navigation = useNavigate();
    function logout(){
        window.sessionStorage.clear();
        navigation(0);
    }
    return (
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <Link class="navbar-brand" to="/">Notion App</Link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <Link to="/" class="nav-link active" aria-current="page" > My Notes</Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link" to="/">Collections</Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link" to="/">Friends</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <span class="navbar-text" style={{marginRight: '20px', cursor: 'pointer', color: 'white'}} onClick={logout}>
                Logout
            </span>

        </nav>
    );
}