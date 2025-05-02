import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './App.css';

const Recipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) {
        setError("Рецепт не знайдено");
        return;
      }

      try {
        const response = await fetch(`http://localhost:3001/recipes/${id}`);
        if (!response.ok) throw new Error("Не вдалося отримати рецепт");

        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error(error);
        setError("Помилка завантаження рецепта");
      }
    };

    fetchRecipe();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!recipe) {
    return <div>Завантаження...</div>;
  }

  return (
    <div>
      {}
      <header>
        <h1>Смачно разом</h1>
        <button onClick={() => navigate("/")}>Повернутись на головну</button>
      </header>

      <section id="recipe-details">
        <div className="recipe-container">
          <div className="recipe-image">
            <img src={recipe.image} alt={recipe.name} />
          </div>
          <div className="recipe-description">
            {}
            <h2>{recipe.name}</h2>

            <h3>Інгредієнти</h3>
            <div className="ingredients">
              <ul>
                {recipe.ingredients.map((ing, index) => (
                  <li key={index}>{ing}</li>
                ))}
              </ul>
            </div>

            <h3>Приготування</h3>
            <p>{recipe.instructions || "Опис приготування відсутній"}</p>

            <h3>Час приготування</h3>
            <p className="time">{recipe.time}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Recipe;
