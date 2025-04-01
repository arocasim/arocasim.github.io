// Функція для додавання рецепту
function addRecipe() {
    let name = prompt("Введіть назву рецепта:");
    if (!name) return;

    let recipeList = document.getElementById("recipes-list");
    let recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");
    recipeCard.innerHTML = `
        <h3>${name}</h3>
        <a href="recipe.html?recipe=${encodeURIComponent(name)}">Переглянути</a>
    `;
    recipeList.appendChild(recipeCard);
}

// Функція для відображення всіх рецептів
function displayRecipes() {
    const recipesContainer = document.getElementById("recipes-container");
    let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

    recipesContainer.innerHTML = ""; // Очистити контейнер

    if (recipes.length === 0) {
        recipesContainer.innerHTML = "<p>Поки що немає рецептів. Додайте свій перший рецепт!</p>";
    } else {
        recipes.forEach((recipe) => {
            const recipeCard = document.createElement("div");
            recipeCard.classList.add("recipe-card");

            const recipeTitle = document.createElement("h3");
            recipeTitle.textContent = recipe.title;

            const recipeIngredients = document.createElement("p");
            recipeIngredients.textContent = `Інгредієнти: ${recipe.ingredients}`;

            const recipeTime = document.createElement("p");
            recipeTime.textContent = `Час приготування: ${recipe.time} хвилин`;

            const recipeImage = document.createElement("img");
            recipeImage.src = recipe.image;
            recipeImage.alt = recipe.title;

            // Кнопка для перегляду рецепту
            const viewBtn = document.createElement("button");
            viewBtn.textContent = "Переглянути";
            viewBtn.classList.add("view-btn");
            viewBtn.addEventListener("click", function() {
                // Перехід на сторінку з детальним рецептом
                window.location.href = `recipe.html?id=${recipe.id}`; // Переходимо на сторінку recipe.html з параметром id
            });

            // Кнопка для видалення рецепту
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Видалити";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener("click", function() {
                // Видалення рецепту
                recipes = recipes.filter(r => r.id !== recipe.id);
                localStorage.setItem("recipes", JSON.stringify(recipes)); // Оновлення в localStorage
                displayRecipes(); // Оновлення відображення
            });

            // Додавання елементів в картку рецепту
            recipeCard.appendChild(recipeTitle);
            recipeCard.appendChild(recipeIngredients);
            recipeCard.appendChild(recipeTime);
            recipeCard.appendChild(recipeImage);
            recipeCard.appendChild(viewBtn); // Додавання кнопки перегляду
            recipeCard.appendChild(deleteBtn); // Додавання кнопки видалення

            // Додавання картки до контейнера
            recipesContainer.appendChild(recipeCard);
        });
    }
}

// Завантажуємо рецепти при завантаженні сторінки
document.addEventListener("DOMContentLoaded", displayRecipes);
document.getElementById("recipe-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // Отримуємо значення з форми
    const title = document.getElementById("recipe-title").value;
    const ingredients = document.getElementById("recipe-ingredients").value;
    const time = document.getElementById("recipe-time").value;
    const image = document.getElementById("recipe-image").value;
    const category = document.getElementById("recipe-category").value;

    // Створюємо об'єкт рецепту
    const recipe = {
        id: Date.now(),  // Використовуємо поточний timestamp як унікальний id
        title,
        ingredients,
        time,
        image,
        category
    };

    // Отримуємо рецепти з localStorage, або створюємо порожній масив
    const recipes = JSON.parse(localStorage.getItem("recipes")) || [];

    // Додаємо новий рецепт
    recipes.push(recipe);

    // Зберігаємо оновлений список в localStorage
    localStorage.setItem("recipes", JSON.stringify(recipes));

    // Перенаправляємо на сторінку "Мої рецепти"
    window.location.href = "index.html";
});

// Завантажуємо рецепти при завантаженні сторінки
document.addEventListener("DOMContentLoaded", function() {
    let myrecipes = JSON.parse(localStorage.getItem("myrecipes")) || [];
    let container = document.getElementById("recipes-container");

    myrecipes.forEach(recipe => {
        let recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        recipeCard.innerHTML = `
            <h3>${recipe.title}</h3>
            <p>Час приготування: ${recipe.time} хв</p>
            <button onclick="viewMyRecipe(${recipe.id})">Переглянути весь рецепт</button>
        `;
        container.appendChild(recipeCard);
    });
});

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
        // Отримуємо список рецептів з localStorage
        let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
        
        // Генеруємо унікальний ID для нового рецепту
        let recipeId = Date.now(); // Використовуємо час як унікальний ID

        // Створюємо новий рецепт
        let newRecipe = {
            id: recipeId,
            title: title,
            ingredients: ingredients,
            time: time,
            image: image,
            category: category
        };

        // Додаємо новий рецепт в список
        recipes.push(newRecipe);

        // Зберігаємо оновлений список у localStorage
        localStorage.setItem("recipes", JSON.stringify(recipes));

        // Перенаправляємо на головну сторінку
        window.location.href = "index.html";
    } else {
        alert("Заповніть всі поля!");
    }
});



// Функція для додавання рецепту через prompt
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
        image: "image.jpg", // Можна змінити на актуальне зображення
        category: "Десерт"
    };

    let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    recipes.push(recipe);
    localStorage.setItem("recipes", JSON.stringify(recipes));

    recipeList.appendChild(recipeCard);
}

// Логування для перевірки збережених рецептів
console.log("Рецепти в localStorage до додавання:", localStorage.getItem("recipes"));


// Завантаження статичних рецептів для категорій
const recipes = [
    {
        id: 1,
        title: "Салат олів'є",
        ingredients: "Картопля, морква, яйця, ковбаса, майонез",
        time: 20,
        image: "https://via.placeholder.com/200",
        category: "breakfast",
    },
    {
        id: 2,
        title: "Борщ",
        ingredients: "Буряк, капуста, картопля, м'ясо, сметана",
        time: 60,
        image: "https://via.placeholder.com/200",
        category: "lunch",
    },
    {
        id: 3,
        title: "Шоколадний торт",
        ingredients: "Борошно, какао, цукор, яйця, масло",
        time: 45,
        image: "https://via.placeholder.com/200",
        category: "desserts",
    },
    {
        id: 4,
        title: "Мохіто",
        ingredients: "Лайм, м'ята, цукор, сода, ром",
        time: 10,
        image: "https://via.placeholder.com/200",
        category: "snacks",
    },
];

// Функція для відображення рецептів по категорії
function displayCategoryRecipes(category) {
    const filteredRecipes = recipes.filter(recipe => recipe.category === category);
    const categoryContainer = document.getElementById("category-recipes");
    categoryContainer.innerHTML = ""; // Очищаємо контейнер перед відображенням нових рецептів

    if (filteredRecipes.length === 0) {
        categoryContainer.innerHTML = "<p>Немає рецептів для цієї категорії.</p>";
    } else {
        filteredRecipes.forEach(recipe => {
            const card = document.createElement("div");
            card.classList.add("recipe-card");
            card.innerHTML = `
                <h4>${recipe.title}</h4>
                <img src="${recipe.image}" alt="${recipe.title}">
                <p>${recipe.ingredients}</p>
                <p>Час приготування: ${recipe.time} хв</p>
                <a href="recipe.html?id=${recipe.id}">Переглянути рецепт</a>
            `;
            categoryContainer.appendChild(card);
        });
    }
}

// Отримуємо ID рецепта з URL
const urlParams = new URLSearchParams(window.location.search);
const recipeId = urlParams.get("id");

if (recipeId) {
    let recipes = JSON.parse(localStorage.getItem("myrecipes")) || [];
    let recipe = recipes.find(r => r.id == recipeId);

    if (recipe) {
        document.getElementById("recipe-title").textContent = recipe.title;
        document.getElementById("recipe-ingredients").textContent = recipe.ingredients;
        document.getElementById("recipe-time").textContent = recipe.time;
        document.getElementById("recipe-image").src = recipe.image;
    }
}
// Функція для додавання рецепту
function addRecipe(event) {
    event.preventDefault();

    let title = document.getElementById("recipe-title").value.trim();
    let ingredients = document.getElementById("recipe-ingredients").value.trim();
    let time = document.getElementById("recipe-time").value.trim();
    let image = document.getElementById("recipe-image").value.trim();
    let category = document.getElementById("recipe-category").value.trim();

    if (title && ingredients && time && category) {
        let myrecipes = JSON.parse(localStorage.getItem("myrecipes")) || [];

        let newRecipe = {
            id: Date.now(),  // Використовуємо поточний час як унікальний ідентифікатор
            title: title,
            ingredients: ingredients,
            time: time,
            image: image || "default.jpg",
            category: category
        };

        myrecipes.push(newRecipe);
        localStorage.setItem("myrecipes", JSON.stringify(myrecipes));

        window.location.href = "index.html";  // Переходимо на головну сторінку
    } else {
        alert("Заповніть всі поля!");
    }
}

// Завантажуємо рецепти на головній сторінці (для myrecipes)
function loadMyRecipes() {
    let myrecipes = JSON.parse(localStorage.getItem("myrecipes")) || [];
    let container = document.getElementById("recipes-container");

    myrecipes.forEach(recipe => {
        let recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        recipeCard.innerHTML = `
            <h3>${recipe.title}</h3>
            <p>Час приготування: ${recipe.time} хв</p>
            <button onclick="viewRecipe(${recipe.id})">Переглянути весь рецепт</button>
        `;
        container.appendChild(recipeCard);
    });
}

// Функція для перегляду рецепту
function viewRecipe(recipeId) {
    window.location.href = `recipe.html?id=${recipeId}`;  // Перехід на сторінку детального рецепта
}

// Завантажуємо деталі рецепта на сторінці recipe.html
function loadRecipeDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get("id");

    if (recipeId) {
        let myrecipes = JSON.parse(localStorage.getItem("myrecipes")) || [];
        let recipe = myrecipes.find(r => r.id == recipeId);

        if (recipe) {
            document.getElementById("recipe-title").textContent = recipe.title;
            document.getElementById("recipe-ingredients").textContent = recipe.ingredients;
            document.getElementById("recipe-time").textContent = recipe.time;
            document.getElementById("recipe-image").src = recipe.image;
        }
    }
}

// Завантаження рецептів на основній сторінці (для загальних рецептів)
function loadAllRecipes() {
    let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

    recipes.forEach(recipe => {
        const recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");
        recipeCard.innerHTML = `
            <h3>${recipe.title}</h3>
            <p>Інгредієнти: ${recipe.ingredients}</p>
            <p>Час приготування: ${recipe.time} хвилин</p>
            <img src="${recipe.image}" alt="${recipe.title}">
            <button onclick="viewRecipe(${recipe.id})">Переглянути деталі</button>
        `;
        document.getElementById("recipes-container").appendChild(recipeCard);
    });
}

// Виконання функцій залежно від сторінки
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("recipe-form")) {
        // Сторінка додавання рецепту
        document.getElementById("recipe-form").addEventListener("submit", addRecipe);
    }

    if (document.getElementById("recipes-container")) {
        // Перевіряємо, чи на сторінці є контейнер для рецептів
        if (window.location.pathname.includes("index.html")) {
            loadMyRecipes();  // Головна сторінка з "Моїми рецептами"
        } else if (window.location.pathname.includes("recipe.html")) {
            loadRecipeDetails();  // Сторінка для перегляду детального рецепта
        } else if (window.location.pathname.includes("category.html")) {
            loadAllRecipes();  // Перегляд всіх рецептів за категорією
        }
    }
});
// Додавання мого рецепту
function addMyRecipe() {
    let title = prompt("Введіть назву рецепта:");
    if (!title) return;

    let myrecipes = JSON.parse(localStorage.getItem("myrecipes")) || [];
    let newRecipe = {
        id: Date.now(),
        title: title,
        ingredients: "Інгредієнти",
        time: "Час приготування",
        image: "default.jpg",
        category: "Category"
    };

    myrecipes.push(newRecipe);
    localStorage.setItem("myrecipes", JSON.stringify(myrecipes));

    // Переходимо на головну сторінку
    window.location.href = "index.html";
}

// Відображення моїх рецептів на сторінці index.html
function displayMyRecipes() {
    const recipesContainer = document.getElementById("recipes-container");
    let myrecipes = JSON.parse(localStorage.getItem("myrecipes")) || [];

    recipesContainer.innerHTML = ""; // Очистити контейнер

    if (myrecipes.length === 0) {
        recipesContainer.innerHTML = "<p>Поки що немає рецептів. Додайте свій перший рецепт!</p>";
    } else {
        myrecipes.forEach((recipe) => {
            const recipeCard = document.createElement("div");
            recipeCard.classList.add("recipe-card");

            const recipeTitle = document.createElement("h3");
            recipeTitle.textContent = recipe.title;

            const recipeIngredients = document.createElement("p");
            recipeIngredients.textContent = `Інгредієнти: ${recipe.ingredients}`;

            const recipeTime = document.createElement("p");
            recipeTime.textContent = `Час приготування: ${recipe.time} хвилин`;

            const recipeImage = document.createElement("img");
            recipeImage.src = recipe.image;
            recipeImage.alt = recipe.title;

            // Кнопка для перегляду рецепту
            const viewBtn = document.createElement("button");
            viewBtn.textContent = "Переглянути";
            viewBtn.classList.add("view-btn");
            viewBtn.addEventListener("click", function() {
                // Перехід на сторінку з детальним рецептом
                window.location.href = `myrecipe.html?id=${recipe.id}`;
            });

            recipeCard.appendChild(recipeTitle);
            recipeCard.appendChild(recipeIngredients);
            recipeCard.appendChild(recipeTime);
            recipeCard.appendChild(recipeImage);
            recipeCard.appendChild(viewBtn);

            recipesContainer.appendChild(recipeCard);
        });
    }
}

// Відображення конкретного рецепту на сторінці myrecipe.html
function displayMyRecipe() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get("id");

    let myrecipes = JSON.parse(localStorage.getItem("myrecipes")) || [];
    let recipe = myrecipes.find(r => r.id == recipeId);

    if (recipe) {
        document.getElementById("recipe-title").textContent = recipe.title;
        document.getElementById("recipe-ingredients").textContent = recipe.ingredients;
        document.getElementById("recipe-time").textContent = recipe.time;
        document.getElementById("recipe-image").src = recipe.image;
    }
}

// Викликаємо відображення рецептів, коли сторінка завантажена
document.addEventListener("DOMContentLoaded", displayMyRecipes);
