import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './App.css';

const Recipes = () => {
  const { id } = useParams(); // Отримуємо id з URL
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch('/recipes.json');
        const data = await response.json();
        console.log("Отримані рецепти:", data);
  
        console.log("id з URL:", id);
        const foundRecipe = data.find(r => r.id === parseInt(id));
  
        if (foundRecipe) {
          console.log("Знайдений рецепт:", foundRecipe);
          setRecipe(foundRecipe);
        } else {
          console.log("Рецепт не знайдено!");
        }
      } catch (error) {
        console.error('Помилка при завантаженні рецепту:', error);
      }
    };
  
    fetchRecipe();
  }, [id]);
  

  useEffect(() => {
    const savedComments = JSON.parse(localStorage.getItem(`comments_${id}`)) || [];
    setComments(savedComments);
  }, [id]);
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !commentText.trim()) return;

    const newComment = { name, text: commentText };
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments));
    setName('');
    setCommentText('');
  };

  return (
    <div>
      <header>
        <h1>Деталі рецепту</h1>
        <button onClick={() => navigate('/')}>Повернутись на головну</button>
      </header>

      {recipe ? (
        <div id="recipe-details">
          <img src={recipe.image} alt={recipe.name} />
          <h2>{recipe.name}</h2>
          <p>Час приготування: {recipe.time}</p>
          <h3>Інгредієнти:</h3>
          <ul>
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
          <h3>Інструкції:</h3>
          <ul>
            {recipe.instructions.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Рецепт не но!</p>
      )}

      <section id="comments-section">
        <h3>Додати коментар</h3>
        <form onSubmit={handleCommentSubmit}>
          <input
            type="text"
            placeholder="Ваше ім'я"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Ваш коментар"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            required
          />
          <button type="submit">Надіслати коментар</button>
        </form>

        <h3>Коментарі:</h3>
        <div id="comments-list">
          {comments.map((c, i) => (
            <div key={i} className="comment">
              <strong>{c.name}</strong>: <p>{c.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Recipes;
