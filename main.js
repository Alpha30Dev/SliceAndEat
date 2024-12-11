class Pizza {
    constructor(id, nom, description, prix, image) {
        this.id = id;
        this.nom = nom;
        this.description = description;
        this.prix = prix;
        this.image = image;
    }
}
const pizzas = [
    new Pizza(1, "La Margherita", "Sauce tomate, mozzarella, basilic frais", 9.99, "pizza1.jpg"),
    new Pizza(2, "La Reine", "Sauce tomate, mozzarella, jambon, champignons", 11.99, "pizza2.jpg"),
    new Pizza(3, "La 4 Fromages", "Sauce tomate, mozzarella, gorgonzola, chèvre, parmesan", 12.99, "pizza3.jpg"),
    new Pizza(4, "La Végétarienne", "Sauce tomate, légumes grillés, olives, champignons", 11.99, "pizza4.jpg"),
    new Pizza(5, "La Pepperoni", "Sauce tomate, mozzarella, pepperoni", 10.99, "pizza5.jpg"),
    new Pizza(6, "La Calzone", "Sauce tomate, mozzarella, jambon, champignons (pizza fermée)", 13.99, "pizza6.jpg"),
    new Pizza(7, "L'Hawaienne", "Sauce tomate, mozzarella, jambon, ananas", 11.99, "pizza7.jpg"),
    new Pizza(8, "La Mexicaine", "Sauce tomate, mozzarella, viande hachée, poivrons, piments", 12.99, "pizza8.jpg"),
    new Pizza(9, "l'Espagnol", "Saute tomate, poivrons, fromage, piments", 11.99, "pizza9.jpg"),
    new Pizza(10, "La Quattro Stagioni", "Sauce tomate, mozzarella, artichauts, jambon, olives", 13.99, "pizza10.jpg"),
    new Pizza(11, "La BBQ Chicken", "Sauce barbecue, poulet, oignons, mozzarella", 12.99, "pizza11.jpg"),
    new Pizza(12, "La Pesto", "Sauce pesto, mozzarella, tomates séchées, roquette", 11.99, "pizza12.jpg"),
    new Pizza(13, "La Fruits de Mer", "Sauce tomate, fruits de mer, mozzarella", 14.99, "pizza13.jpg"),
    new Pizza(14, "La Spéciale", "Sauce tomate, mozzarella, chorizo, poivrons", 12.99, "pizza14.jpg"),
    new Pizza(15, "La Fromage de Chèvre", "Sauce tomate, mozzarella, fromage de chèvre, miel", 13.99, "pizza15.jpg"),
];
const MINIMUM_PASSWORD_LENGTH = 8;
let isLoggedIn = false;
let panier = [];
let panierCount = 0;
let currentPizzaCount = 8;

function createPizzaCard(pizza) {
    return `
        <div class="pizza-card" data-id="${pizza.id}">
            <img src="${pizza.image}" alt="${pizza.nom}">
            <div class="pizza-info">
                <h3>${pizza.nom}</h3>
                <p>${pizza.description}</p>
                <span class="price">${pizza.prix.toFixed(2)}€</span>
                <button class="commander-btn" onclick="commander(${pizza.id})">Commander</button>
            </div>
        </div>
    `;
}
async function fetchPizzas() {
    try {
        // Simule un appel API
        const response = await new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    ok: true,
                    json: () => Promise.resolve(pizzas)
                });
            }, 1000);
        });

        if (!response.ok) {
            throw new Error('Erreur lors du chargement des pizzas');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
}

async function afficherPizzas() {
    const menuContainer = document.getElementById('menu-pizzas');
    if (!menuContainer) return;

    // message pour montrer que les pizzas sont en chargement
    menuContainer.innerHTML = '<p>Chargement des pizzas...</p>';

    const pizzasData = await fetchPizzas();
    const pizzasToShow = pizzasData.slice(0, currentPizzaCount);
    menuContainer.innerHTML = pizzasToShow.map(pizza => createPizzaCard(pizza)).join('');
}

// Fonction pour commander une pizza
function commander(pizzaId) {
    if (!checkLoginStatus()) {
        alert('Veuillez vous connecter pour commander');
        window.location.href = 'PageConnexion.html';
        return;
    }

    const pizza = pizzas.find(p => p.id === pizzaId);
    if (pizza) {
        panier.push(pizza);
        panierCount = panier.length;
        updatePanierCount();
        
        // Sauvegarde du panier dans localStorage
        localStorage.setItem('panier', JSON.stringify(panier));
        
        // Calcul du total
        const total = panier.reduce((sum, item) => sum + item.prix, 0);
        alert(`Pizza ajoutée ! Total du panier: ${total.toFixed(2)}€`);
    }
}

// fonction pour mettre à jour le compteur du panier
function updatePanierCount() {
    const panierCountElement = document.querySelector('.panier-count');
    if (panierCountElement) {
        panierCountElement.textContent = panierCount;
    }
}

function afficherPlus() {
    currentPizzaCount += 8;
    afficherPizzas();
}

// Événement pour le bouton "Afficher plus"
document.addEventListener('DOMContentLoaded', () => {
    const showMoreBtn = document.getElementById('show-more-btn');
    if (showMoreBtn) {
        console.log("Bouton 'Afficher plus' trouvé");
        showMoreBtn.addEventListener('click', afficherPlus);
    } else {
        console.error("Le bouton 'Afficher plus' n'a pas été trouvé");
    }
});

// Fonction pour vérifier l'état de connexion
function checkLoginStatus() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.isLoggedIn) {
        isLoggedIn = true;
        return true;
    }
    return false;
}

// Fonction pour récupérer les paramètres URL
function getUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const user = urlParams.get('user');
    const pays = urlParams.get('pays');
    return { user, pays };
}

document.addEventListener('DOMContentLoaded', () => {
    const { user, pays } = getUrlParameters();
    if (user && checkLoginStatus()) {
        const userIcon = document.querySelector('.utilisateur');
        if (userIcon) {
            userIcon.title = `Connecté en tant que ${user}`;
        }
    }
    afficherPizzas();
    updatePanierCount();
});



// Fonction de validation du formulaire
function handleSubmit(event) {
    event.preventDefault();
    
    // Récupération des valeurs du formulaire
    const username = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const pays = document.getElementById('pays').value;
    
    // Validation basique
    if (password.length < 8) {
        alert('Le mot de passe doit contenir au moins 8 caractères');
        return;
    }
    
    // Sauvegarde des données utilisateur
    const userData = {
        username,
        email,
        pays,
        isLoggedIn: true
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Redirection vers la page d'accueil
    window.location.href = `pageAccueil.html?user=${username}&pays=${pays}`;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
// ragex pour valider l'email
// regarde si il a pas d'espace ou de @...

function handleUserIconClick() {
    window.location.href = 'PageConnexion.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const userIcon = document.querySelector('.utilisateur');
    if (userIcon) {
        userIcon.style.cursor = 'pointer';
        userIcon.addEventListener('click', handleUserIconClick);
    }
});

function deconnexion() {
    localStorage.removeItem('userData');
    window.location.href = 'pageAccueil.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const deconnexionBtn = document.querySelector('.deconnexion-btn');
    if (deconnexionBtn) {
        deconnexionBtn.addEventListener('click', deconnexion);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    panier = JSON.parse(localStorage.getItem('panier')) || [];
    panierCount = panier.length;
    updatePanierCount();
    afficherPanier();
});

function afficherPanier() {
    const panierItemsContainer = document.getElementById('panier-items');
    const totalPanierElement = document.getElementById('total-panier');
    if (!panierItemsContainer || !totalPanierElement) return;

        panierItemsContainer.innerHTML = '';
        let total = 0;

        panier.forEach(pizza => {
            const item = document.createElement('div');
            item.className = 'panier-item';
            item.innerHTML = `
                <img src="${pizza.image}" alt="${pizza.nom}" class="panier-item-image">
                <div class="panier-item-info">
                    <h3>${pizza.nom}</h3>
                    <p>${pizza.description}</p>
                    <span class="price">${pizza.prix.toFixed(2)}€</span>
                </div>
            `;
            panierItemsContainer.appendChild(item);
            total += pizza.prix;
        });

        totalPanierElement.textContent = total.toFixed(2) + '€';
    }


document.addEventListener('DOMContentLoaded', () => {

    const panierIcon = document.querySelector('.panier');
    if (panierIcon) {
        panierIcon.addEventListener('click', () => {
            window.location.href = 'PagePanier.html';
        });
    }
    if (panierIcon) {
        panierIcon.style.cursor = 'pointer';
    }
});

function passerCommande() {
    if (panier.length === 0) {
        alert('Votre panier est vide !');
        return;
    }

    // Calculer le total de la commande
    const total = panier.reduce((sum, item) => sum + item.prix, 0);
    const confirmation = confirm(`Voulez-vous confirmer votre commande pour un total de ${total.toFixed(2)}€ ?`);

    if (confirmation) {
        // Récupérer l'historique des commandes
        let historique = JSON.parse(localStorage.getItem('historique')) || [];
        
        // Ajouter la commande actuelle à l'historique
        historique.push(...panier);
        localStorage.setItem('historique', JSON.stringify(historique));

        // Vider le panier
        panier = [];
        localStorage.setItem('panier', JSON.stringify(panier));
        panierCount = 0;
        updatePanierCount();
        alert('Votre commande a été validée avec succès !');
        window.location.href = 'pageAccueil.html';
    }
}
function afficherHistorique() {
    const historiqueContainer = document.getElementById('historique-items');
    if (!historiqueContainer) return;

    const historique = JSON.parse(localStorage.getItem('historique')) || [];
    historiqueContainer.innerHTML = '';

    historique.forEach(pizza => {
        const item = document.createElement('div');
        item.className = 'historique-item';
        item.innerHTML = `
            <div class="historique-item-info">
                <h3>${pizza.nom}</h3>
            </div>
            <img src="${pizza.image}" alt="${pizza.nom}" class="historique-item-image">
            <div class="historique-item-info">
                <p>${pizza.description}</p>
                <span class="price">${pizza.prix.toFixed(2)}€</span>
            </div>
        `;
        historiqueContainer.appendChild(item);
    });
}

// Appeler afficherHistorique lors du chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    afficherHistorique();
});

document.addEventListener('DOMContentLoaded', () => {
    // Gestion de l'icône utilisateur
    const userIcon = document.querySelector('.utilisateur');
    if (userIcon) {
        userIcon.addEventListener('click', handleUserIconClick);
    }

    // Gestion du bouton de déconnexion
    const deconnexionBtn = document.querySelector('.deconnexion-btn');
    if (deconnexionBtn) {
        deconnexionBtn.addEventListener('click', deconnexion);
    }
});

function commanderPromo(nom, description, prix, image) {
    if (!checkLoginStatus()) {
        alert('Veuillez vous connecter pour commander');
        window.location.href = 'PageConnexion.html';
        return;
    }

    const pizzaPromo = {
        id: Date.now(), // Génère un ID unique
        nom: nom,
        description: description,
        prix: prix,
        image: image
    };

    panier.push(pizzaPromo);
    panierCount = panier.length;
    updatePanierCount();
    
    // Sauvegarde du panier dans localStorage
    localStorage.setItem('panier', JSON.stringify(panier));
    
    // Calcul du total
    const total = panier.reduce((sum, item) => sum + item.prix, 0);
    alert(`Pizza ${nom} ajoutée ! Total du panier: ${total.toFixed(2)}€`);
}
