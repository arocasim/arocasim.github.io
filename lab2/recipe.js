// Статичні рецепти
const recipes = [
    { name: "Омлет", ingredients: "Яйця, молоко, сіль, перець", time: 10, image: "image/omlet.jpg", category: "Сніданки" },
    { name: "Сирники", ingredients: "Сир, яйце, цукор, борошно", time: 20, image: "image/syrnyky.jpg", category: "Сніданки" },
    { name: "Борщ", ingredients: "Буряк, капуста, картопля, м'ясо", time: 60, image: "image/borsh.jpg", category: "Обіди" },
    { name: "Курка з рисом", ingredients: "Курка, рис, спеції", time: 40, image: "image/kurka-ris.jpg", category: "Обіди" },
    { name: "Паста", ingredients: "Макарони, соус, сир", time: 25, image: "image/pasta.jpg", category: "Вечері" },
    { name: "Запечена риба", ingredients: "Риба, лимон, спеції", time: 30, image: "image/ryba.jpg", category: "Вечері" }
];

// Отримуємо параметр 'recipe' з URL
const urlParams = new URLSearchParams(window.location.search);
const recipeName = urlParams.get("recipe");

// Шукаємо рецепт за назвою
const recipe = recipes.find(r => r.name === recipeName);

if (recipe) {
    // Виводимо інформацію про рецепт на сторінку
    document.getElementById("recipe-title").textContent = recipe.name;
    document.getElementById("recipe-ingredients").textContent = recipe.ingredients;
    document.getElementById("recipe-time").textContent = recipe.time;
    document.getElementById("recipe-category").textContent = recipe.category;
    document.getElementById("recipe-image").src = recipe.image;
    document.getElementById("recipe-image").alt = recipe.name;
} else {
    // Якщо рецепт не знайдений
    document.getElementById("recipe-details").innerHTML = "<p>Рецепт не знайдено.</p>";
}
