let xp = 0;
let health = 100;
let gold = 50;
let currentWeaponIndex = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");

const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
    {
        name: " stick",
        power: 5
    },
    {
        name: " dagger",
        power: 30
    },
    {
        name: " claw hammer",
        power: 50
    },
    {
        name: " sword",
        power: 75
    },
    {
        name: " bigger sword",
        power: 100
    }
];

const monsters = [
    {
      name: "slime",
      level: 2,
      health: 15,
    },
    {
      name: "fanged beast",
      level: 8,
      health: 60,
    },
    {
      name: "dragon",
      level: 20,
      health: 300,
    }
  
];

const locations = [
    {
        name: "town square",
        "button text": ["Store", "Explore", "Fight Dragon"],
        "button functions": [goStore, goCave, dragonFight],
        text: "You are back in the town square. You see a sign saying \"Store\"."
    },
    {
        name: "store",
        "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "You enter the store."
    },
    {
        name: "cave",
        "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
        "button functions": [fightSlime, fightBeast, goTown],
        text: "You enter the cave. You see some monsters."
    },
    {
        name: "fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, goTown],
        text: "A monster has appeared!"
    },
    {
        name: "kill monster",
        "button text": ["Go to town square", "Go to town square", "Go to town square"],
        "button functions": [goTown, easterEgg, goTown],
        text: "The monster screams in pain as it dies. You gain experience and find gold."
    },
    {
        name: "lose",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You die. &#x2620;"
    },
    {
        name: "win",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You defeated the dragon! YOU WIN! &#x1F389;"
    },
    {
        name: "easter egg",
        "button text": ["2", "8", "Go to town square?"],
        "button functions": [pickTwo, pickEight, goTown],
        text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
    }

];


function update(location) {
    monsterStats.style.display = 'none';
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerHTML = location.text;
}

function goTown() {
    update(locations[0]);
}

function goStore(){
    update(locations[1]);
}

function goCave(){
    update(locations[2]);
}



function buyHealth() {
    if (health < 100){
        if (gold >= 10) {
            gold -= 10;
            health += 10;
            goldText.innerText = gold;
            healthText.innerText = health;
        } else {
            text.innerText = "You lack sufficient funds for this item.";
        }
    } 
    
}



function buyWeapon() {
    if (currentWeaponIndex < weapons.length - 1) {
        if(gold >= 30){
            gold -= 30;
            currentWeaponIndex ++;
            goldText.innerText = gold;
            let newWeapon = weapons[currentWeaponIndex].name;
            text.innerText = "You have acquired " + newWeapon + ". You feel stronger.";
            inventory.push(newWeapon);
            text.innerText += " In your inventory you have: " + inventory;
        } else {
            text.innerText = "You lack the sufficient gold for this item.";
        }
    } else {
        text.innerText = "You have bought everything in my store, traveller.";
        button2.innerText = "Sell weapon? (15 gold)";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon () {
    if (inventory.length > 1) {
        gold += 15;
        goldText.innerText = gold;
        let currentWeapon = inventory.shift();
        text.innerText = "You sold a " + currentWeapon + ".";
        text.innerText += " In your inventory you have: " + inventory;
    } else {
        text.innerText = "It is unwise to leave unarmed."
    }
}

function goFight () {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = 'block';
    monsterName.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
}

function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += Math.floor(Math.random() * monsters[fighting].level + 1);
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]);
}

function lose() {
    update(locations[5]);
}

function winGame(){
    update(locations[6]);
  }

function fightSlime() {
    fighting = 0;
    goFight();
}

function fightBeast() {
    fighting = 1;
    goFight();
}

function dragonFight() {
    fighting = 2;
    goFight();
}

function attack() {
    text.innerText = "The " + monsters[fighting].name + " attacks."
    text.innerText += " You attack it with your " + weapons[currentWeaponIndex].name + ".";
    health -= getMonsterAttackValue(monsters[fighting].level);
    if (isMonsterHit()) {
        monsterHealth -= weapons[currentWeaponIndex].power + Math.floor(Math.random() * xp) + 1;    
      } else {
        text.innerText += " You missed."
      }
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;
    if (health <= 0) {
        lose();
    } else if (monsterHealth <= 0) {
        if (fighting === 2){
            winGame();
          } else {
            defeatMonster();
          }
    }
    if (Math.random() <= .1 && inventory.length !== 1){
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeaponIndex --;
    }
}

function isMonsterHit() {
    return Math.random() > .2 || health < 20;
}

function getMonsterAttackValue(level){
    const hit = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(hit);
    return hit > 0 ? hit : 0;
}

function dodge() {
    text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

function restart() {
    xp = 0;
    health = 100;
    gold = 50;
    currentWeaponIndex = 0;
    inventory = ["stick"];
    goldText.innerText = gold;
    xpText.innerText = xp;
    healthText.innerText = health;
    goTown();
}

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = dragonFight;

function easterEgg() {
    update(locations[7]);
}

function pickTwo() {
    pick(2)
}
  
  function pickEight() {
    pick(8)
}

function pick(guess) {
    const numbers = [];
    while (numbers.length < 10){
        numbers.push(Math.floor(Math.random() * 11));
    }
    text.innerText = "You picked " + guess + ". Here are the random numbers:\n"
    for (let i = 0; i< 10; i++) {
        text.innerText += numbers[i] + "\n";
        if (numbers.includes(guess)){
            text.innerText += "Right! You win 20 gold!";
            gold += 20;
            goldText.innerText = gold;
        } else {
            text.innerText += "Wrong! You lose 10 health!";
            health -= 10;
            healthText.innerText = health;
            if (health <= 0) {
                lose();
            }
        }
    }
}