const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

// Fonctions utilitaires pour lire/écrire des fichiers JSON à placer ici

const readJson = (path) => {
  const raw = fs.readFileSync(path, "utf-8");
  return JSON.parse(raw);
};

const writeJson = (path, data) => {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
};

const afficherFichier = (chemin) => {
  const contenu = readJson(chemin);
  console.log(contenu);
};

// Test de démarrage

// afficherFichier("./data/posts.json");


app.get('/', (req, res) => {
  res.send('Bienvenue sur l’API du mini-blog !');
});

// Routes à compléter ici

app.get("/posts", (req,res) => {
  try {
    const posts = readJson("./data/posts.json");
    res.json(posts);
  } catch (error) {
    res.status(500).send("internal error");
  }  
});


app.get("/posts/:id", (req, res) => {
  try {
    const posts = readJson("./data/posts.json");
    const postId = parseInt(req.params.id);
    const post = posts.find((p) => p.id === postId);

    if (!post) {
      return res.status(404).send("not found");
    }

    res.json(post);
  } catch (error) {
    res.status(500).send("internal error");
  }
});


app.post("/posts", (req, res) => {
  try {
    const posts = readJson("./data/posts.json");

    let newId;
    if(posts.length > 0) {
      newId = posts[posts.length - 1].id + 1;
    } else {
      newId = 1;
    }
  
    const newPost = {
      id: newId,
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    };

    posts.push(newPost);
    writeJson("./data/posts.json", posts);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).send("internal error");
  }
});



// Lancement du serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
