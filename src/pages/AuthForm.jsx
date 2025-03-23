import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HomeOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useLoginMutation, useRegisterMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";
import FormContainer from "../components/FormContainer";
import Loading from "../components/Loading";
import Swal from "sweetalert2";
import "../styles/Form.css";

const FormAuth = () => {
  // Login State
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register State
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [isSame, setIsSame] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const { isLogin } = useSelector((state) => state.auth);

  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    if (isLogin && !hasNavigated) {
      navigate("/");
      setHasNavigated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependensi kosong, useEffect hanya dijalankan sekali

  const toggleForm = () => {
    setIsActive(!isActive);
  };

  const toggleVisible = () => {
    setIsVisible(!isVisible);
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    if (loginUsername === "" || loginPassword === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Tolong isi semua field",
      });
      return;
    }
    try {
      const res = await login({ username: loginUsername, password: loginPassword }).unwrap();
      dispatch(setCredentials(res["access_token"]));
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Login berhasil",
      }).then(() => {
        window.location.reload();
      });
    } catch (err) {
      setLoginUsername("");
      setLoginPassword("");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: err?.data?.detail || "Login gagal",
      });
    }
  };

  useEffect(() => {
    setIsSame(password === confirmPassword);
  }, [password, confirmPassword]);

  const registerHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Password tidak sama",
      });
    } else if (password === "" || confirmPassword === "" || email === "" || username === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Tolong isi semua field",
      });
    } else {
      try {
        await register({ username, email, password, role: "user" }).unwrap();
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Registrasi berhasil, silahkan login",
        }).then(() => {
          toggleForm();
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err?.data?.detail || "Registrasi gagal",
        });
      }
    }
  };

  return (
    <FormContainer>
      <div
        className={isActive ? "container active" : "container"}
        id="container">
        <div className="form-container sign-up">
          <form onSubmit={registerHandler}>
            <h1>Daftar</h1>
            <span>Daftarkan dirimu dengan mengisi data dibawah</span>
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {(password !== "" || confirmPassword !== "") && (
              <small
                id="same-password-msg"
                style={{ color: isSame ? "green" : "red" }}>
                {isSame ? "Password sama" : "Password tidak sama"}
              </small>
            )}
            <button
              id="register-button"
              disabled={isRegisterLoading}
              type="submit">
              {isRegisterLoading ? <Loading /> : "Daftar"}
            </button>
          </form>
        </div>
        <div className="form-container sign-in">
          <form onSubmit={loginHandler}>
            <h1>Masuk</h1>
            <span>Login untuk menggunakan semua fitur</span>
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                name="username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                id="loginpassword"
                type={isVisible ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <span
                className="eye"
                onClick={toggleVisible}>
                {isVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </span>
            </div>
            <button
              disabled={isLoginLoading}
              type="submit">
              {isLoginLoading ? <Loading /> : "Masuk"}
            </button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <a href="/">
                <HomeOutlined
                  style={{
                    fontSize: "2rem",
                    color: "#fff",
                    display: "flex",
                    justifyContent: "center",
                  }}
                />
              </a>
              <h1>Selamat Datang!</h1>
              <p>Sudah memiliki akun? </p>
              <button
                className="hidden"
                id="login"
                onClick={toggleForm}>
                Masuk
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <a href="/">
                <HomeOutlined
                  style={{
                    fontSize: "2rem",
                    color: "#fff",
                    display: "flex",
                    justifyContent: "center",
                  }}
                  disabled={isLoginLoading || isRegisterLoading}
                />
              </a>
              <h1>Halo Boy!</h1>
              <p>Belum Punya Akun? </p>
              <button
                disabled={isRegisterLoading || isLoginLoading}
                className="hidden"
                id="register"
                onClick={toggleForm}>
                Daftar
              </button>
            </div>
          </div>
        </div>
      </div>
    </FormContainer>
  );
};

export default FormAuth;
