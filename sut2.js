const motSecret = "TROUVER";
const nombreEssais = 6;
const longueurMot = 7;

let essais = 0;
let motActuel = "";
let termine = false;

const grille = document.getElementById("grille");
const input = document.getElementById("proposition");
const formulaire = document.getElementById("formulaire");
const message = document.getElementById("message");
const clavier = document.getElementById("clavier");
const boutonRejouer = document.getElementById("rejouer");
const boutonValider = document.getElementById("valider");

// Création de la grille
for (let i = 0; i < nombreEssais; i++) {
const ligne = document.createElement("div");
ligne.className = "ligne";

for (let j = 0; j < longueurMot; j++) {
const caseLettre = document.createElement("div");
caseLettre.className = "case";
ligne.appendChild(caseLettre);
}

grille.appendChild(ligne);
}

// Création du clavier virtuel
const rangees = ["AZERTYUIOP", "QSDFGHJKLM", "WXCVBN"];

rangees.forEach(function(lettres) {
const rangee = document.createElement("div");
rangee.className = "rangee-clavier";

for (const lettre of lettres) {
const touche = document.createElement("button");
touche.type = "button";
touche.textContent = lettre;
touche.className = "touche";
touche.dataset.lettre = lettre;

touche.addEventListener("click", function() {
ajouterLettre(lettre);
});

rangee.appendChild(touche);
}

clavier.appendChild(rangee);
});

// Clavier physique
document.addEventListener("keydown", function(event) {
if (termine) return;

if (event.key === "Backspace") {
motActuel = motActuel.slice(0, -1);
afficherMot();
} else if (event.key === "Enter") {
formulaire.requestSubmit();
} else if (/^[a-zA-Z]$/.test(event.key)) {
ajouterLettre(event.key.toUpperCase());
}
});

// Ajouter une lettre
function ajouterLettre(lettre) {
if (termine || motActuel.length >= longueurMot) return;

motActuel += lettre;
afficherMot();
}

// Afficher le mot dans la grille
function afficherMot() {
const cases = grille.children[essais].children;

for (let i = 0; i < longueurMot; i++) {
cases[i].textContent = motActuel[i] || "";
}

input.value = motActuel;
}

// Validation du mot
formulaire.addEventListener("submit", function(event) {
event.preventDefault();

if (termine) return;

motActuel = input.value.toUpperCase().trim();

if (!/^[A-Z]{7}$/.test(motActuel)) {
message.textContent = "Entre un mot de 7 lettres sans accent.";
return;
}

afficherResultat(motActuel);
essais++;

if (motActuel === motSecret) {
message.textContent = "Bravo, tu as trouvé le mot !";
terminer();
} else if (essais === nombreEssais) {
message.textContent = "Perdu ! Le mot était " + motSecret + ".";
terminer();
} else {
message.textContent = "Il te reste " + (nombreEssais - essais) + " essais.";

motActuel = "";
input.value = "";
input.focus();
}
});

// Vérifier les lettres
function afficherResultat(mot) {
const cases = grille.children[essais].children;
const lettresRestantes = motSecret.split("");

// Lettres bien placées
for (let i = 0; i < longueurMot; i++) {
cases[i].textContent = mot[i];

if (mot[i] === motSecret[i]) {
cases[i].classList.add("bonne");
lettresRestantes[i] = null;
}
}

// Lettres présentes mais mal placées
for (let i = 0; i < longueurMot; i++) {
if (cases[i].classList.contains("bonne")) continue;

const position = lettresRestantes.indexOf(mot[i]);

if (position !== -1) {
cases[i].classList.add("presente");
lettresRestantes[position] = null;
} else {
cases[i].classList.add("absente");
}
}

mettreAJourClavier(mot, cases);
}

// Colorer les touches
function mettreAJourClavier(mot, cases) {
for (let i = 0; i < longueurMot; i++) {
const touche = clavier.querySelector(
'[data-lettre="' + mot[i] + '"]'
);

if (!touche) continue;

if (cases[i].classList.contains("bonne")) {
touche.className = "touche bonne";
} else if (
cases[i].classList.contains("presente") &&
!touche.classList.contains("bonne")
) {
touche.className = "touche presente";
} else if (
cases[i].classList.contains("absente") &&
!touche.classList.contains("bonne") &&
!touche.classList.contains("presente")
) {
touche.className = "touche absente";
}
}
}

// Fin de la partie
function terminer() {
termine = true;
input.disabled = true;
boutonValider.disabled = true;
boutonRejouer.hidden = false;
}

// Recommencer
boutonRejouer.addEventListener("click", function() {
window.location.reload();
});
