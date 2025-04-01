const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get("id");

// Отримуємо список рецептів з localStorage
const recipes = JSON.parse(localStorage.getItem("recipes")) || [];

// Шукаємо рецепт за його ID
const recipe = recipes.find(r => r.id.toString() === recipeId);

if (recipe) {
    // Якщо рецепт знайдений, заповнюємо дані
    document.getElementById("recipe-title").textContent = recipe.title;
    document.getElementById("recipe-ingredients").textContent = recipe.ingredients;
    document.getElementById("recipe-time").textContent = recipe.time;
    document.getElementById("recipe-category").textContent = recipe.category;
    document.getElementById("recipe-image").src = recipe.image;
} else {
    // Якщо рецепт не знайдений, виводимо повідомлення
    document.getElementById("recipe-details").innerHTML = "<p>Рецепт не знайдений.</p>";
}
