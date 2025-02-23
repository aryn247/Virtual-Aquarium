document.addEventListener("DOMContentLoaded", () => {
  const aquarium = document.getElementById("aquarium");
  const addFishBtn = document.getElementById("addFish");
  const nightModeBtn = document.getElementById("toggleNightMode");

  const fishImages = [
      "fish-removebg-preview.png",
      "fiish-removebg-preview.png",
      "fish.01-removebg-preview.png"
  ];

  // Bubble Sound Effect
  function playBubbleSound() {
      const sound = new Audio("bubble.mp3");
      sound.volume = 0.5; // Adjust volume
      sound.play();
  }

  // Create Fish Function
  function createFish() {
      if (!aquarium) {
          console.error("Aquarium element not found!");
          return;
      }

      const fish = document.createElement("div");
      fish.classList.add("fish");
      fish.style.backgroundImage = `url(${fishImages[Math.floor(Math.random() * fishImages.length)]})`;

      let startX = Math.random() * (aquarium.clientWidth - 100);
      let startY = Math.random() * (aquarium.clientHeight - 100);

      fish.style.left = `${startX}px`;
      fish.style.top = `${startY}px`;

      fish.dataset.size = 1;
      fish.dataset.hunger = 100;
      fish.dataset.age = 0;

      aquarium.appendChild(fish);
      animateFish(fish);
  }

  addFishBtn.addEventListener("click", createFish);

  // Animate Fish (Smooth Movement)
  function animateFish(fish) {
      function move() {
          let maxX = aquarium.clientWidth - 50;
          let maxY = aquarium.clientHeight - 50;
          let newX = Math.random() * maxX;
          let newY = Math.random() * maxY;

          fish.style.transition = "left 3s linear, top 3s linear";
          fish.style.left = `${newX}px`;
          fish.style.top = `${newY}px`;

          playBubbleSound(); // Play sound when fish move

          setTimeout(move, 3000);
      }
      move();
  }

  // Feeding Fish (Smooth Approach)
  function dropFood(event) {
      const food = document.createElement("div");
      food.classList.add("food");
      food.style.left = `${event.clientX}px`;
      food.style.top = `${event.clientY}px`;
      aquarium.appendChild(food);

      document.querySelectorAll(".fish").forEach(fish => {
          let fishX = parseInt(fish.style.left);
          let fishY = parseInt(fish.style.top);
          let foodX = event.clientX;
          let foodY = event.clientY;

          let distance = Math.hypot(foodX - fishX, foodY - fishY);
          if (distance < 200) {
              fish.style.transition = "left 2s ease-in-out, top 2s ease-in-out";
              fish.style.left = `${foodX}px`;
              fish.style.top = `${foodY}px`;

              playBubbleSound(); // Play sound when fish move towards food

              growFish(fish);
              fish.dataset.hunger = 100;
              fish.style.filter = "brightness(1)";
          }
      });

      setTimeout(() => food.remove(), 4000);
  }

  aquarium.addEventListener("click", dropFood);

  // Fish Growth
  function growFish(fish) {
      let size = parseInt(fish.dataset.size);
      if (size < 5) {
          size++;
          fish.dataset.size = size;
          fish.style.width = `${50 + size * 10}px`;
          fish.style.height = `${50 + size * 10}px`;
      }
  }

  // Fish Mood & Health System
  setInterval(() => {
      document.querySelectorAll(".fish").forEach(fish => {
          let hunger = parseInt(fish.dataset.hunger);
          hunger -= 5;
          fish.dataset.hunger = hunger;

          if (hunger < 50) {
              fish.style.filter = "brightness(0.7)";
          }
          if (hunger <= 0) {
              fish.remove();
          }
      });
  }, 5000);

  // Fish Breeding (With Age Factor)
  setInterval(() => {
      const fishes = document.querySelectorAll(".fish");
      if (fishes.length >= 2) {
          const fish1 = fishes[Math.floor(Math.random() * fishes.length)];
          const fish2 = fishes[Math.floor(Math.random() * fishes.length)];

          if (fish1 !== fish2) {
              let distance = Math.hypot(
                  parseInt(fish1.style.left) - parseInt(fish2.style.left),
                  parseInt(fish1.style.top) - parseInt(fish2.style.top)
              );

              let age1 = parseInt(fish1.dataset.age);
              let age2 = parseInt(fish2.dataset.age);

              if (distance < 100 && age1 > 1 && age2 > 1) {
                  setTimeout(createFish, 3000);
                  playBubbleSound(); // Play sound when new fish is created
              }
          }
      }
  }, 5000);

  // Age System for Fish
  setInterval(() => {
      document.querySelectorAll(".fish").forEach(fish => {
          let age = parseInt(fish.dataset.age);
          fish.dataset.age = age + 1;
      });
  }, 10000);

  // Treasure Chest Feature (Smooth Animation)
  function createTreasureChest() {
      const chest = document.createElement("div");
      chest.classList.add("treasure-chest");
      chest.style.left = "50%";
      chest.style.bottom = "20px";
      aquarium.appendChild(chest);

      setInterval(() => {
          chest.classList.add("open");
          setTimeout(() => chest.classList.remove("open"), 3000);
          playBubbleSound(); // Play sound when chest opens
      }, 10000);
  }

  createTreasureChest();

  // Night Mode Toggle
  nightModeBtn.addEventListener("click", () => {
      document.body.classList.toggle("night-mode");
  });
});
