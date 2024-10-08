// Importer les fonctions nécessaires depuis Firebase SDK
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, push, get, remove } from "firebase/database";

// Configuration de votre application Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCL0VrMAt9XNGgX1e0_HIEVC03teeOvqtY",
    authDomain: "marciojardel-ce0d5.firebaseapp.com",
    databaseURL: "https://marciojardel-ce0d5-default-rtdb.firebaseio.com",
    projectId: "marciojardel-ce0d5",
    storageBucket: "marciojardel-ce0d5.appspot.com",
    messagingSenderId: "313912737797",
    appId: "1:313912737797:web:72fee65438c79c86715c6c",
    measurementId: "G-YN957W0TE0"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Fonction pour publier un article
function publishArticle(name, price, imageFile) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const article = {
            name: name,
            price: price,
            image: e.target.result
        };

        // Écrire l'article dans Firebase
        const newArticleRef = push(ref(database, 'articles')); // Génère une nouvelle référence
        set(newArticleRef, article)
            .then(() => {
                console.log("Article ajouté avec succès !");
                loadArticles(); // Met à jour l'affichage
            })
            .catch((error) => {
                console.error("Erreur lors de l'ajout de l'article : ", error);
            });
    };
    reader.readAsDataURL(imageFile); // Convertit l'image en URL
}

// Fonction pour charger les articles
function loadArticles() {
    const articleList = document.getElementById("article-list");
    articleList.innerHTML = ""; // Vider la liste actuelle
    const articlesRef = ref(database, 'articles');

    // Lire les articles depuis Firebase
    get(articlesRef).then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const article = childSnapshot.val();
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <strong>${article.name}</strong> - ${article.price} € <img src="${article.image}" alt="${article.name}" style="width: 100px;">
                <button class="delete-btn" data-key="${childSnapshot.key}">Supprimer</button>`;
            articleList.appendChild(listItem);

            // Ajouter la fonctionnalité de suppression
            listItem.querySelector(".delete-btn").addEventListener("click", function() {
                deleteArticle(childSnapshot.key);
            });
        });
    }).catch((error) => {
        console.error("Erreur lors de la lecture des articles : ", error);
    });
}

// Fonction pour supprimer un article
function deleteArticle(articleKey) {
    const articleRef = ref(database, 'articles/' + articleKey);
    remove(articleRef) // Supprime l'article de Firebase
        .then(() => {
            console.log("Article supprimé avec succès !");
            loadArticles(); // Met à jour l'affichage
        })
        .catch((error) => {
            console.error("Erreur lors de la suppression de l'article : ", error);
        });
}

// Charger les articles lorsque la page se charge
document.addEventListener("DOMContentLoaded", loadArticles);

function ajouterArticle() {
    // Code pour ajouter l'article

    // Afficher le message de succès
    alert("Article ajouté avec succès !");
    
    // Optionnel : rediriger vers une autre page ou actualiser la liste des articles
    // location.reload(); // Pour actualiser la page
    // window.location.href = 'page_suivante.html'; // Pour rediriger vers une autre page
}


// Fonction pour charger les articles
function loadArticles() {
    articleList.innerHTML = ""; // Vider la liste actuelle
    const articlesRef = ref(database, 'articles');

    // Lire les articles depuis Firebase
    get(articlesRef).then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const article = childSnapshot.val();
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <strong>${article.name}</strong> - ${article.price} € 
                <img src="${article.image}" alt="${article.name}" style="width: 100px;">
                <button class="delete-btn" data-key="${childSnapshot.key}">Supprimer</button>
                <button class="add-to-cart-btn" data-key="${childSnapshot.key}">Ajouter au panier</button>`; // Ajout du bouton "Ajouter au panier"
            articleList.appendChild(listItem);

            // Ajouter la fonctionnalité de suppression
            listItem.querySelector(".delete-btn").addEventListener("click", function() {
                deleteArticle(childSnapshot.key);
            });

            // Ajouter la fonctionnalité "Ajouter au panier"
            listItem.querySelector(".add-to-cart-btn").addEventListener("click", function() {
                addToCart(article);
            });
        });
    }).catch((error) => {
        console.error("Erreur lors de la lecture des articles : ", error);
    });
}

// Fonction pour ajouter un article au panier
let cart = []; // Panier vide au début

function addToCart(article) {
    cart.push(article); // Ajouter l'article au panier
    console.log("Article ajouté au panier:", article);
    alert(`${article.name} a été ajouté au panier !`); // Alerte pour confirmation
}


// Fonction pour ajouter un article au panier
function addToCart(article) {
    cart.push(article); // Ajouter l'article au panier
    localStorage.setItem('cart', JSON.stringify(cart)); // Stocker le panier dans localStorage
    console.log("Article ajouté au panier:", article);
    alert(`${article.name} a été ajouté au panier !`); // Alerte pour confirmation
}

window.location.href = "admin/fournisseur.html";
