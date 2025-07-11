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

// Nouvelle version de la route GET /posts avec filtre par auteur à la fin du fichier

// app.get("/posts", (req,res) => {
//   try {
//     const posts = readJson("./data/posts.json");
//     res.json(posts);
//   } catch (error) {
//     res.status(500).send("internal error");
//   }  
// });


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


app.patch("/posts/:id", (req, res) => {
  try {
    const posts = readJson("./data/posts.json");
    const postId = parseInt(req.params.id);
    const post = posts.find((p) => p.id === postId);
    
    if (!post) {
      return res.status(404).send("not found");
    }

    if (req.body.title) {
      post.title = req.body.title;
    }
    if (req.body.content) {
      post.content = req.body.content;
    }
    if (req.body.author) {
      post.author = req.body.author;
    }

    writeJson("./data/posts.json", posts);
    res.json(post);
  } catch (error) {
    res.status(500).send("internal error");
  }  
});


app.delete("/posts/:id", (req, res) => {
  try {
    const posts = readJson("./data/posts.json");
    const postId = parseInt(req.params.id);
    const index = posts.findIndex((p) => p.id === postId);

    if (index === -1) {
      return res.status(404).send("not found");
    }

    posts.splice(index, 1); 
    writeJson("./data/posts.json", posts);
    res.send("post deleted");
  } catch (error) {
    res.status(500).send("internal error");
  }  
 });


 app.get("/posts/:id/comments", (req, res) => {
  try {
    const comments = readJson("./data/comments.json");
    const postId = parseInt(req.params.id);
    const isCommentOfPost = ((c) => c.postId === postId);
    const commentsOfPost = comments.filter(isCommentOfPost);

    res.json(commentsOfPost);
  } catch (error) {
    res.status(500).send("internal error");
  }
 });


 app.post("/posts/:id/comments", (req, res) => {
  try {
    const comments = readJson("./data/comments.json");
    const postId = parseInt(req.params.id);

    let newId;
    if(comments.length > 0) {
      newId = comments[comments.length - 1].id + 1;
    } else {
      newId = 1;
    }
    const newComment = {
      id: newId,
      postId: postId,
      author: req.body.author,
      content: req.body.content,
    };

    comments.push(newComment);
    writeJson("./data/comments.json", comments);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).send("internal error");
  
  }
 });


 app.delete("/comments/:id", (req, res) => {
   try {
     const comments = readJson("./data/comments.json");
     const commentId = parseInt(req.params.id);
     const index = comments.findIndex((c) => c.id === commentId);

     if (index === -1) {
       return res.status(404).send("not found");
     }

     comments.splice(index, 1);
     writeJson("./data/comments.json", comments);
     res.send("comment deleted");
   } catch (error) {
     res.status(500).send("internal error");
   }
 });


app.get("/posts", (req, res) => {
  try {
  const posts = readJson("./data/posts.json");
  const authorFilter = req.query.author;

  let result = posts;
  
  if (authorFilter) {
    result = result.filter((p) => p.author === authorFilter);
  }
  res.json(result);

  } catch (error) {
    res.status(500).send("internal error");
  }
});


app.get("/stats", (req, res) => {
  try {
    const posts = readJson("./data/posts.json");
    const comments = readJson("./data/comments.json");

    res.json({
      totalPosts: posts.length,
      totalComments: comments.length
    });
  } catch (error) {
    res.status(500).send("internal error");
  }
});


// Lancement du serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
