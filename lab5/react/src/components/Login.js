import React, { useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return Swal.fire("Помилка", "Будь ласка, заповніть всі поля", "error");
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userName = userDoc.data().name;
        Swal.fire("Успішний вхід", `Ласкаво просимо, ${userName || "користувач"}!`, "success");
        navigate('/');
      } else {
        Swal.fire("Помилка", "Не вдалося знайти користувача в базі даних", "error");
      }
    } catch (error) {
      Swal.fire("Помилка", error.message, "error");
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          uid: user.uid,
        });
      }

      Swal.fire("Успішний вхід через Google!", `Вітаємо, ${user.displayName || "користувач"}!`, "success");
      navigate('/');
    } catch (error) {
      Swal.fire("Помилка входу через Google", error.message, "error");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Вхід</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="login-btn">Увійти</button>

        <div className="or-divider">або</div>

        <button type="button" className="login-btn google" onClick={handleGoogleLogin}>
          Увійти через Google
        </button>

        <div className="login-link-container">
          <p>Немає акаунта?</p>
          <Link to="/signup" className="login-link">Зареєструватися</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
