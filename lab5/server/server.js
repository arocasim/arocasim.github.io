const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

const app = express();
const PORT = 5000;
const SECRET_KEY = 'f2a7cb8bfe0d89a31ad8b46c8edb726e30aa9a99879a7fda1320de78495a8815';

app.use(cors());
app.use(express.json());

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const recipesCollection = db.collection('Recipes');

let users = [];
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Користувач вже існує' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ id: users.length + 1, email, password: hashedPassword, name });
  res.status(201).json({ message: 'Користувач створений' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: 'Користувача не знайдено' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ message: 'Невірний пароль' });

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

app.get('/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });
  res.json({ id: user.id, email: user.email, name: user.name });
});

app.get('/api/recipes', async (req, res) => {
  try {
    const { userId } = req.query;
    const snapshot = await recipesCollection.get();
    let recipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (userId) {
      recipes = recipes.filter(recipe => recipe.userId === userId);
    }

    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка отримання рецептів' });
  }
});

app.get('/api/recipes/sorted', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'userId обов\'язковий' });
    }

    const snapshot = await recipesCollection.where('userId', '==', userId).get();
    let recipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    recipes.sort((a, b) => {
      const timeA = parseInt(a.time);
      const timeB = parseInt(b.time);
      return timeA - timeB;
    });

    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сортування рецептів' });
  }
});

app.get('/api/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = recipesCollection.doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ message: 'Рецепт не знайдено' });
    }

    res.json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка отримання рецепта' });
  }
});


app.post('/api/recipes', async (req, res) => {
  try {
    const newRecipe = req.body;
    const docRef = await recipesCollection.add(newRecipe);
    const doc = await docRef.get();
    res.status(201).json({ id: docRef.id, ...doc.data() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка додавання рецепта' });
  }
});

app.put('/api/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await recipesCollection.doc(id).update(req.body);
    const updatedDoc = await recipesCollection.doc(id).get();
    res.json({ id, ...updatedDoc.data() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка оновлення рецепта' });
  }
});

app.delete('/api/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await recipesCollection.doc(id).delete();
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка видалення рецепта' });
  }
});

const buildPath = path.resolve(__dirname, '../new-react-app/build');

app.use(express.static(buildPath));

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    next();
  } else {
    res.sendFile(path.join(buildPath, 'index.html'));
  }
});

app.listen(PORT, () => console.log(`Сервер запущено на http://localhost:${PORT}`));
