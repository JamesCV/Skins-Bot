import './SignInWithSteam.css';


function SignInWithSteam() {
  const handleLogin = () => {
    window.open("http://localhost:5001/auth/steam", "_self");
  };

  return (
    <div className="SignInContainer">
      <a className="steambutton" onClick={handleLogin}>
        <span className="signInText"> Login With Steam </span>
        <div className="icon">
    		  <i className="fa fa-steam-square"></i>
    	  </div>
      </a>
    </div>
  );
}

export default SignInWithSteam;
