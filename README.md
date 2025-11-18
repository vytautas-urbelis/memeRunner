# MemeRunner Game

MemeRunner is a dynamic, browser-based game developed using JavaScript and HTML5 Canvas. The game challenges players to dodge obstacles and collect points as they navigate through a continuously scrolling environment, driven by a parallax effect.

## Features

- **Dynamic Obstacle Avoidance:** Players must avoid various obstacles that appear randomly on the track.
- **Shooting Mechanics:** Armed with a gun and 3 ammunition units, players can shoot and destroy obstacles for bonus points.
- **Ammunition System:** Ammunition regenerates automatically (+1 every 3 seconds when below maximum).
- **Smooth Animations:** Features polished shooting animations with muzzle flash, gun recoil, and particle-based explosion effects.
- **Scoring System:** Points are accumulated by avoiding obstacles, and the game speed increases as the player's score gets higher. Destroying obstacles awards +50 bonus points.
- **Local Storage for Scores:** Utilizes browser's local storage to save and retrieve player's nickname and scores.

## Technologies Used

- **HTML5 Canvas:** For rendering game visuals and animations.
- **JavaScript:** For game logic and interaction handling.
- **Local Storage:** To store player data between sessions.

## Setup

To run MemeRunner locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone [your-repository-link]

2. Open the `index.html` file in a modern web browser.

## How to Play

- **Start the Game:** Open the `index.html` file in your browser to start the game.
- **Jump:** Press the space bar to jump and avoid obstacles. Press space twice quickly for a double jump.
- **Shoot:** Press 'X' or 'F' key to shoot obstacles, or click the "SHOOT" button. You start with 3 ammunition units.
- **Ammunition:** Ammo regenerates automatically at +1 every 3 seconds when below the maximum of 3 units.
- **Scoring:** Earn points by avoiding obstacles. Destroy obstacles by shooting them for +50 bonus points!
- **Pause/Resume Game:** The game pauses automatically when an obstacle is hit and can be resumed by following on-screen instructions.

## Contributing

Contributions to the MemeRunner game are welcome! If you have suggestions or improvements, please fork the repository and submit a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

Vytautas Urbelis

Try it: [MemeRunner](https://vytautas-urbelis.github.io/memeRunner/)
