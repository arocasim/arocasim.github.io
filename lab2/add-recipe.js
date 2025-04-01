document.getElementById("recipe-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // Отримуємо значення з полів форми
    let title = document.getElementById("recipe-title").value.trim();
    let ingredients = document.getElementById("recipe-ingredients").value.trim();
    let time = document.getElementById("recipe-time").value.trim();
    let image = document.getElementById("recipe-image").value.trim();
    let category = document.getElementById("recipe-category").value.trim();

    // Перевіряємо, чи всі поля заповнені
    if (title && ingredients && time && image && category) {
        // Отримуємо список рецептів із localStorage
        let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
        
        // Перевірка на дублікати
        let isDuplicate = recipes.some(recipe => recipe.title === title && recipe.ingredients === ingredients);
        
        // Якщо рецепту немає в списку
        if (!isDuplicate) {
            let newRecipe = {
                title: title,
                ingredients: ingredients,
                time: time,
                image: image,
                category: category
            };

            // Додаємо новий рецепт в список
            recipes.push(newRecipe);
            localStorage.setItem("recipes", JSON.stringify(recipes));

            // Повертаємо на головну сторінку після додавання
            window.location.href = "index.html";
        } else {
            alert("Цей рецепт вже існує!");
        }
    } else {
        alert("Заповніть всі поля!");
    }
});

// Функція для додавання рецепту
function addRecipe() {
    let name = prompt("Введіть назву рецепта:");
    if (!name) return;

    let recipeList = document.getElementById("recipes-list");
    let recipeId = Date.now(); // Використовуємо час як унікальний id для рецепта
    let recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");
    recipeCard.innerHTML = `
        <h3>${name}</h3>
        <a href="recipe.html?id=${recipeId}">Переглянути</a>
    `;

    let recipe = {
        id: recipeId,
        title: name,
        ingredients: "Інгредієнти...",
        time: 30,
        image: "image.jpg", // Ти можеш додати реальне зображення
        category: "Десерт"
    };

    let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    recipes.push(recipe);
    localStorage.setItem("recipes", JSON.stringify(recipes));

    recipeList.appendChild(recipeCard);
}
