// Отримуємо контейнер для рецептів
const recipesContainer = document.getElementById("recipes-container");

// Отримуємо рецепти з localStorage
const recipes = JSON.parse(localStorage.getItem("recipes")) || [];

// Перевірка, чи є рецепти
if (recipes.length > 0) {
    recipes.forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        recipeCard.innerHTML = `
            <h3>${recipe.title}</h3>
            <a href="myrecipe.html?id=${recipe.id}">Переглянути</a>
        `;
        recipesContainer.appendChild(recipeCard);
    });
} else {
    recipesContainer.innerHTML = "<p>У вас ще немає рецептів.</p>";
}
