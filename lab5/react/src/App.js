import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./App.css";
import Categories from "./Categories";
import Recipe from "./recipe";
import Recipes from "./recipes";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase-config";

const auth = getAuth();

function Home() {
  const [userName, setUserName] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthorVisible, setIsAuthorVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribe = null;
  
    const authUnsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await fetchUserName(user.uid);
  
        unsubscribe = subscribeToUserRecipes(user);
      } else {
        setCurrentUser(null);
        setRecipes([]);
        if (unsubscribe) unsubscribe();
      }
    });
  
    return () => {
      authUnsub();
      if (unsubscribe) unsubscribe();
    };
  }, []);
  
  

  const fetchUserName = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUserName(userDoc.data().name);
      }
    } catch (error) {
      console.error("Помилка отримання імені користувача:", error);
    }
  };

  const fetchSortedRecipes = async (user) => {
    if (!user) return;
  
    try {
      const token = await user.getIdToken(); // 🔐 тепер точно не null
  
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) throw new Error("Forbidden");
  
      const fetchedRecipes = await response.json();
      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error("Помилка завантаження рецептів:", error);
    }
  };
  
  
  const handleSignOut = () => {
    signOut(auth)
      .then(() => setCurrentUser(null))
      .catch((error) => console.error("Помилка при виході:", error));
  };

  const handleAddRecipe = () => {
    if (!currentUser) {
      Swal.fire("Будь ласка, увійдіть у систему, щоб додавати рецепти.");
      return;
    }

    Swal.fire({
      title: "Додати новий рецепт",
      html: `
        <input id="recipe-name" class="swal2-input" placeholder="Назва рецепта">
        <input id="recipe-image" class="swal2-input" placeholder="Зображення (URL)">
        <input id="recipe-ingredients" class="swal2-input" placeholder="Інгредієнти (через кому)">
        <input id="recipe-time" class="swal2-input" type="number" min="1" step="1" placeholder="Час приготування (у хв.)">
        <select id="recipe-category" class="swal2-select">
          <option value="Сніданки">Сніданки</option>
          <option value="Обіди">Обіди</option>
          <option value="Десерти">Десерти</option>
          <option value="Закуски">Закуски</option>
        </select>
        <textarea id="recipe-instructions" class="swal2-textarea" placeholder="Опис кроків приготування (кожен крок з нового рядка)"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: "Додати",
      cancelButtonText: "Скасувати",
      preConfirm: async () => {
        const newRecipe = {
          name: document.getElementById("recipe-name").value.trim(),
          image: document.getElementById("recipe-image").value.trim(),
          ingredients: document.getElementById("recipe-ingredients").value.trim().split(","),
          time: document.getElementById("recipe-time").value.trim(),
          category: document.getElementById("recipe-category").value,
          instructions: document.getElementById("recipe-instructions").value.trim().split("\n"),
          userId: currentUser.uid,
        };

        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes`, {

            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newRecipe),
          });

          if (!response.ok) throw new Error();

          await fetchSortedRecipes(currentUser.uid); // ⬅️ після додавання перезапитуємо список СОРТОВАНИЙ
          Swal.fire("Рецепт додано!", "", "success");
        } catch (error) {
          Swal.fire("Помилка", "Не вдалося додати рецепт", "error");
        }
      }
    });
  };

  const handleDeleteRecipe = async (id) => {
    const result = await Swal.fire({
      title: 'Ви впевнені, що хочете видалити цей рецепт?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Так, видалити',
      cancelButtonText: 'Скасувати'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${id}`, 
          { method: 'DELETE' });
        if (!response.ok) throw new Error();
        await fetchSortedRecipes(currentUser.uid); // ⬅️ після видалення перезапитуємо список СОРТОВАНИЙ
        Swal.fire('Рецепт видалено', '', 'success');
      } catch (error) {
        Swal.fire('Помилка', 'Не вдалося видалити рецепт', 'error');
      }
    }
  };

  const handleEditRecipe = (recipe) => {
    Swal.fire({
      title: "Редагувати рецепт",
      html: `
        <input id="recipe-name" class="swal2-input" value="${recipe.name}">
        <input id="recipe-image" class="swal2-input" value="${recipe.image}">
        <input id="recipe-ingredients" class="swal2-input" value="${recipe.ingredients.join(",")}">
        <input id="recipe-time" class="swal2-input" type="number" min="1" step="1" value="${parseInt(recipe.time)}" placeholder="Час приготування (у хв.)">
        <select id="recipe-category" class="swal2-select">
          <option value="Сніданки" ${recipe.category === 'Сніданки' ? 'selected' : ''}>Сніданки</option>
          <option value="Обіди" ${recipe.category === 'Обіди' ? 'selected' : ''}>Обіди</option>
          <option value="Десерти" ${recipe.category === 'Десерти' ? 'selected' : ''}>Десерти</option>
          <option value="Закуски" ${recipe.category === 'Закуски' ? 'selected' : ''}>Закуски</option>
        </select>
        <textarea id="recipe-instructions" class="swal2-textarea">${Array.isArray(recipe.instructions) ? recipe.instructions.join("\n") : recipe.instructions}</textarea>
      `,
      showCancelButton: true,
      confirmButtonText: "Зберегти зміни",
      cancelButtonText: "Скасувати",
      preConfirm: async () => {
        const updatedRecipe = {
          name: document.getElementById("recipe-name").value.trim(),
          image: document.getElementById("recipe-image").value.trim(),
          ingredients: document.getElementById("recipe-ingredients").value.trim().split(","),
          time: document.getElementById("recipe-time").value.trim(),
          category: document.getElementById("recipe-category").value,
          instructions: document.getElementById("recipe-instructions").value.trim().split("\n"),
          userId: currentUser.uid,
        };

        try {

          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/recipes/${recipe.id}`, {

            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedRecipe),
          });

          if (!response.ok) throw new Error();

          await fetchSortedRecipes(currentUser.uid); // ⬅️ після редагування перезапитуємо список СОРТОВАНИЙ
          Swal.fire("Оновлено!", "", "success");
        } catch (error) {
          Swal.fire("Помилка", "Не вдалося оновити рецепт", "error");
        }
      }
    });
  };

  
  const toggleAuthorInfo = () => setIsAuthorVisible(!isAuthorVisible);

  return (
    <div>
      <header className="header">
  <h1>Смачно разом: платформа для обміну рецептами</h1>
  
  <nav className="nav-container">
    <ul className="nav-list">
      <li><a href="#my-recipes">Мої рецепти</a></li>
      <li><a href="#categories">Категорії</a></li>
      <li><a href="#about-us">Про нас</a></li>
      <li><a href="#about-author">Про автора</a></li>
    </ul>

    <div className="auth-buttons">
      {!currentUser ? (
        <>
          <Link to="/login" className="btn">Увійти</Link>
        </>
      ) : (
        <>
          <span> {currentUser && <p>Ви увійшли як {userName}!</p>}
          </span>
          <button onClick={handleSignOut} className="btn">Вийти</button>
        </>
      )}
    </div>
  </nav>
</header>

      <section id="my-recipes">
        <h2>Мої рецепти</h2>
        <ul className="recipes-grid">
          {recipes.map((recipe, index) => (
            <li key={recipe.id} className="recipe-card" style={{ backgroundColor: index % 2 === 0 ? "rgb(54, 48, 48)" : "#7c6f65" }}>
              <img src={recipe.image} alt={recipe.name} />
              <h3>{recipe.name}</h3>
              <p>Категорія: {recipe.category}</p>
              <p>Час приготування: {recipe.time}</p>
              <Link to={`/recipe/${recipe.id}`}>
                <button>Детальніше</button>
              </Link>
              <button onClick={() => handleEditRecipe(recipe)}>Редагувати</button>
              <button onClick={() => handleDeleteRecipe(recipe.id)}>Видалити</button>
            </li>
          ))}
        </ul>
        <div className="add-recipe-container">
          <button onClick={handleAddRecipe} id="add-recipe-btn">+ Додати рецепт</button>
        </div>
      </section>

      <section id="categories">
        <h2>Категорії</h2>
        <button onClick={() => navigate('/categories')}>Перейти на рецепти по категоріях</button>
      </section>

      <section id="about-us">
        <h2>Про нас</h2>
        <p>
          Ласкаво просимо на нашу платформу для обміну рецептами! Ми прагнемо
          об'єднати кулінарних ентузіастів з усього світу, щоб вони могли ділитися
          своїми улюбленими стравами та знаходити натхнення для нових кулінарних
          шедеврів. Наша місія — створити спільноту, де кожен, від початківця до
          професіонала, може знайти щось для себе.
        </p>
        <p>
          Приєднуйтесь до нас і відкрийте для себе безмежний світ смаків та ароматів!
        </p>
      </section>

      <section id="about-author">
        <button onClick={toggleAuthorInfo} id="toggle-button">
          {isAuthorVisible ? "Сховати 'Про автора'" : "Показати 'Про автора'"}
        </button>

        {isAuthorVisible && (
          <div id="author-info" className="author-info">
            <div className="author-photo-container">
              <img src="images/author.jpeg" alt="Ектор, шеф-кухар" className="author-photo" id="author-photo" />
            </div>
            <div className="author-details">
              <h3>Ектор, шеф-кухар</h3>
              <p>
                Ектор — відомий шеф-кухар з популярного шоу "Мастер Шеф". Його любов до кулінарії і прагнення створювати неперевершені страви надихають багатьох готувати з душею та любов'ю.
              </p>
            </div>
          </div>
        )}
      </section>

      <footer className="footer">
        <p>© 2025 Смачно разом: платформа для обміну рецептами</p>
        <p className="footer-contact">
          Телефон: <a href="tel:+38(063)141-31-22">+38(063)141-31-22</a>
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<Recipe />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/recipes/:id" element={<Recipes />} />
      </Routes>
    </Router>
  );
}

export default App;
