import React, { useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, set, get } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const Categories = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [allergens, setAllergens] = useState([]);
  const navigate = useNavigate();
  const auth = getAuth(); 

  const loadRecipes = async () => {
    try {
      const response = await fetch('/recipes.json');
      const data = await response.json();
      setRecipes(data);
      setFilteredRecipes(data);
    } catch (error) {
      console.error('Помилка при завантаженні рецептів:', error);
    }
  };

  const loadFavoritesFromFirebase = async () => {
    const user = auth.currentUser;
    if (user) {
      const db = getDatabase();
      const favoritesRef = ref(db, 'favorites/' + user.uid); 
      const snapshot = await get(favoritesRef);
      if (snapshot.exists()) {
        setFavorites(Object.values(snapshot.val()));  
      } else {
        setFavorites([]);
      }
    }
  };

  useEffect(() => {
    loadRecipes();
    loadFavoritesFromFirebase(); 
  }, []);

  const filterRecipes = (category) => {
    let filtered = [];

    if (category === 'all') {
      filtered = recipes;
    } else if (category === 'favorites') {
      filtered = favorites;
    } else {
      filtered = recipes.filter(recipe => recipe.category === category);
    }

    filtered = filtered.filter(recipe =>
      !allergens.some(allergen =>
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(allergen.toLowerCase()))
      )
    );

    setFilteredRecipes(filtered);
  };

  const toggleFavorite = async (id) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Будь ласка, увійдіть в систему");
      return;
    }

    let updatedFavorites = [...favorites];
    const recipe = recipes.find(r => r.id === id);

    if (updatedFavorites.some(r => r.id === id)) {
      updatedFavorites = updatedFavorites.filter(r => r.id !== id);
    } else {
      updatedFavorites.push(recipe);
    }

    setFavorites(updatedFavorites);

    const db = getDatabase();
    const userRef = ref(db, 'favorites/' + user.uid);
    set(userRef, updatedFavorites);
  };

  const viewRecipe = (id) => {
    navigate(`/recipes/${id}`);
  };

  const addAllergen = (event) => {
    event.preventDefault();
    const allergen = event.target.elements.allergen.value.trim();
    if (allergen && !allergens.includes(allergen)) {
      setAllergens(prevAllergens => {
        const updatedAllergens = [...prevAllergens, allergen];
        filterRecipes('all');
        return updatedAllergens;
      });
    }
    event.target.reset();
  };

  const handleCategoryChange = (category) => {
    filterRecipes(category);
  };

  return (
    <div>
      <header className="header">
        <h1>Смачно разом</h1>
        <nav>
          <button onClick={() => navigate('/')}>На головну</button>
        </nav>
      </header>

      <main>
        <h2>Рецепти</h2>

        <section id="allergen-form">
          <h2>Введіть інгредієнт, на який у вас алергія</h2>
          <form onSubmit={addAllergen}>
            <input type="text" name="allergen" placeholder="Інгредієнт" required />
            <button type="submit">Додати алерген</button>
          </form>
          <ul>
            {allergens.length > 0 && <h4>Ваші алергени:</h4>}
            {allergens.map((allergen, index) => (
              <li key={index}>{allergen}</li>
            ))}
          </ul>
        </section>

        <div className="filter-buttons">
          <button onClick={() => handleCategoryChange('all')}>Всі</button>
          <button onClick={() => handleCategoryChange('breakfast')}>Сніданки</button>
          <button onClick={() => handleCategoryChange('lunch')}>Обіди</button>
          <button onClick={() => handleCategoryChange('dessert')}>Десерти</button>
          <button onClick={() => handleCategoryChange('snack')}>Закуски</button>
          <button onClick={() => handleCategoryChange('favorites')}>Моє вибране</button>
        </div>

        <section id="recipes">
          <ul id="recipes-grid" className="recipes-grid">
            {filteredRecipes.length === 0 ? (
              <p>Немає рецептів, що відповідають фільтру.</p>
            ) : (
              filteredRecipes.map(recipe => (
                <li key={recipe.id} className="recipe-card">
                  <img src={recipe.image} alt={recipe.name} />
                  <h3>{recipe.name}</h3>
                  <p>Час приготування: {recipe.time}</p>
                  <button onClick={() => viewRecipe(recipe.id)}>Детальніше</button>
                  <button onClick={() => toggleFavorite(recipe.id)}>
                    {favorites.some(r => r.id === recipe.id) ? 'Видалити з вибраного' : 'Додати рецепт до вибраного'}
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>
      </main>

      <footer className="footer">
        <p>© 2025 Смачно разом: платформа для обміну рецептами</p>
        <p className="footer-contact">
          Телефон: <a href="tel:+38(063)141-31-22">+38(063)141-31-22</a>
        </p>
      </footer>
    </div>
  );
};

export default Categories;
