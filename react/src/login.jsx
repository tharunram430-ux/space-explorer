import { useNavigate } from "react-router-dom";
import "./header.css";

function Header() {
        const navigate = useNavigate();

        function login(event) {
            event.preventDefault();
            navigate("/frontmain");
        }
    
        return(
            <div className="main">
            <div className="head">
               <form onSubmit={login}>
                <h1>
                Space Explorer
            </h1>
             
            <input type="text" placeholder="Enter ur username" className="box"  required /> <br />
            <br />
            <input type="password" placeholder="Enter ur password"  className="box" required /> <br />
        
            <button id="but" type="submit">Login</button>
           </form>
            <hr />
            <h2>@ ur own risk</h2>






        </div>
        </div>
        )
    }

    export default Header;