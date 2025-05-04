const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();
const recipesCollection = db.collection('Recipes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(403).json({ message: 'Недійсний токен' });
  }
}

// ✅ Отримати всі рецепти поточного користувача
app.get('/api/recipes', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const snapshot = await recipesCollection.where('userId', '==', userId).get();
    const recipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка отримання рецептів' });
  }
});

// ✅ Сортування рецептів поточного користувача за часом
app.get('/api/recipes/sorted', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const snapshot = await recipesCollection.where('userId', '==', userId).get();
    let recipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    recipes.sort((a, b) => parseInt(a.time) - parseInt(b.time));
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка сортування рецептів' });
  }
});

// ✅ Отримати один рецепт (без обмеження по userId)
app.get('/api/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const docSnap = await recipesCollection.doc(id).get();
    if (!docSnap.exists) return res.status(404).json({ message: 'Рецепт не знайдено' });
    res.json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка отримання рецепта' });
  }
});

// ✅ Додати рецепт (встановлюється userId із токена)
app.post('/api/recipes', verifyFirebaseToken, async (req, res) => {
  try {
    const newRecipe = { ...req.body, userId: req.user.uid };
    const docRef = await recipesCollection.add(newRecipe);
    const doc = await docRef.get();
    res.status(201).json({ id: docRef.id, ...doc.data() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка додавання рецепта' });
  }
});

// ✅ Оновити рецепт
app.put('/api/recipes/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const { id } = req.params;
    const recipeRef = recipesCollection.doc(id);
    const existing = await recipeRef.get();

    if (!existing.exists || existing.data().userId !== req.user.uid) {
      return res.status(403).json({ message: 'Немає доступу до оновлення цього рецепта' });
    }

    await recipeRef.update(req.body);
    const updatedDoc = await recipeRef.get();
    res.json({ id, ...updatedDoc.data() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка оновлення рецепта' });
  }
});

// ✅ Видалити рецепт
app.delete('/api/recipes/:id', verifyFirebaseToken, async (req, res) => {
  try {
    const { id } = req.params;
    const recipeRef = recipesCollection.doc(id);
    const existing = await recipeRef.get();

    if (!existing.exists || existing.data().userId !== req.user.uid) {
      return res.status(403).json({ message: 'Немає доступу до видалення цього рецепта' });
    }

    await recipeRef.delete();
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка видалення рецепта' });
  }
});

// ✅ Frontend build
const buildPath = path.resolve(__dirname, '../react/build');
app.use(express.static(buildPath));

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    next();
  } else {
    res.sendFile(path.join(buildPath, 'index.html'));
  }
});

app.listen(PORT, () => console.log(`Сервер запущено на http://localhost:${PORT}`));
