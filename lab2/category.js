// Статичні рецепти для кожної категорії
const recipesByCategory = {
    breakfast: [
        { name: "Омлет", link: "recipe.html?recipe=Омлет" },
        { name: "Сирники", link: "recipe.html?recipe=Сирники" }
    ],
    lunch: [
        { name: "Борщ", link: "recipe.html?recipe=Борщ" },
        { name: "Курка з рисом", link: "recipe.html?recipe=Курка%20з%20рисом" }
    ],
    dinner: [
        { name: "Паста", link: "recipe.html?recipe=Паста" },
        { name: "Запечена риба", link: "recipe.html?recipe=Запечена%20риба" }
    ]
};

// Отримуємо категорію з URL
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get("category");

// Перевіряємо, чи є така категорія
if (recipesByCategory[category]) {
    // Встановлюємо заголовок категорії
    document.getElementById("category-title").textContent = category.charAt(0).toUpperCase() + category.slice(1);

    // Отримуємо контейнер для рецептів
    let recipesGrid = document.querySelector(".recipes-grid");

    // Додаємо картки рецептів до контейнера
    recipesByCategory[category].forEach(recipe => {
        let recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        recipeCard.innerHTML = `
            <h3>${recipe.name}</h3>
            <a href="${recipe.link}">Переглянути</a>
        `;
        recipesGrid.appendChild(recipeCard);
    });
} else {
    // Якщо категорія не знайдена
    document.getElementById("category-recipes").innerHTML = "<p>Категорія не знайдена.</p>";
}
