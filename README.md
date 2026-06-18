# ⚔️ Simple Battle RPG Frontend

A fantasy-themed Web3 RPG frontend built with TypeScript, Vite and ethers.js for interacting with an on-chain Solidity RPG smart contract deployed on Ethereum Sepolia.

Players can connect wallets, create heroes, battle monsters, challenge other players, join guilds, earn achievement NFTs and progress through a fully on-chain RPG experience.

---

# 🌐 Live DApp

Demo DApp:

https://ethereum-simple-rpg-game.vercel.app/

---

# 📜 Smart Contract


## Supported Networks

- Ethereum Sepolia
- Arbitrum Sepolia
- Arbitrum One

## Etherscan

https://sepolia.etherscan.io/address/0xce7db8f0442fa80c0fab9799e069a94fa477089d

https://sepolia.arbiscan.io/address/0xaf6e5c828cca5cabca85733bc45e318c8bc83141

https://arbiscan.io/address/0x39a85c7d3db291da733b9d085b3de8f4f425eb5c

### Contracts

Ethereum Sepolia
`0xce7db8f0442fa80c0fab9799e069a94fa477089d`

Arbitrum Sepolia
`0xaf6e5c828cca5cabca85733bc45e318c8bc83141`

Arbitrum One
`0x39a85C7d3dB291DA733B9d085B3DE8F4F425Eb5c`

## Solidity Source Code

https://github.com/brunolcarli/simpleRPG

---

# ⚔️ Features

* 🔗 Connect EVM wallets
* 🧙 Register RPG characters
* ⚔️ PvE monster battles
* 🛡️ PvP player battles
* 🏰 Guild system
* 🏆 Top Players leaderboard
* 👑 Top Guilds leaderboard
* 🎖️ Achievement NFT system
* 🛡️ Anti-farming PvP rules
* 📊 Dynamic guild point calculation
* 📜 Real-time Solidity battle logs
* ❤️ Heal characters
* ☠️ Revive characters
* 🔍 Search any player wallet
* 👾 Inspect enemy stats
* 📈 Character progression system
* 💰 ETH-based rewards
* 💥 Critical hit mechanics
* 🌩️ Fully on-chain game logic

---

# 🏰 Guild System

Players can:

* Create guilds
* Join guilds
* Leave guilds
* Manage guild membership
* Earn guild points through PvP victories
* Compete for Top Guild rankings

Guild rankings are stored fully on-chain.

Guild points are awarded dynamically based on:

* Defeated player's level
* Relative level difference between players
* PvP difficulty

To prevent abuse and farming:

* Players cannot challenge opponents with a level difference greater than 10 levels
* Defeating low-level players grants fewer guild points
* Defeating stronger players grants more guild points

---

# 🎖️ Achievement NFTs

Players can unlock and mint achievement NFTs by completing in-game challenges.

Current achievements include:

* 👺 Goblin Slayer
* 🪓 Orc Slayer
* 💀 Skeleton Slayer
* 🧟 Zombie Slayer
* 🐺 Werewolf Slayer
* 🧝 Dark Elf Slayer
* 🦎 Great Lizard Slayer
* 🪨 Troll Slayer
* 🧚 Dark Fairy Slayer
* 🐉 Dragon Slayer
* ⚔️ PvP Master

Achievement metadata and artwork are hosted on IPFS.

---

# 🏆 Rankings

## Top Players

Player leaderboard generated from on-chain character data and blockchain activity.

Displays:

* Character name
* Class
* Level
* Wallet address

## Top Guilds

Guild ranking based on guild points.

Displays:

* Guild name
* Member count
* Total points

---

# 🎮 Game Systems

## Character Classes

| Class       | Description         |
| ----------- | ------------------- |
| 🗡️ Warrior | High HP and defense |
| 🪄 Mage     | High magic damage   |
| 🏹 Ranger   | Balanced fighter    |

---

## Enemies

| Enemy           | Description              |
| --------------- | ------------------------ |
| 👺 Goblin       | Weak starter enemy       |
| 🪓 Orc          | Physical fighter         |
| 💀 Skeleton     | Balanced undead          |
| 🧟 Zombie       | High HP tank             |
| 🐺 Werewolf     | Fast attacker            |
| 🧝 Dark Elf     | Magic attacker           |
| 🦎 Great Lizard | Balanced reptile monster |
| 🪨 Troll        | Tank enemy               |
| 🧚 Dark Fairy   | Powerful magic enemy     |
| 🐉 Dragon       | Endgame boss             |

---

# 💰 ETH Gameplay Mechanics

## Character Registration

```solidity
0.0001 ether
```

## Common Actions

```solidity
commonPrice = 0.001 ether
```

Used for:

* PvP Battles
* Heal
* Revive

## Dynamic Battle Cost

Battle costs scale according to selected rounds.

```solidity
battleCost = commonPrice * rounds
```

Example:

| Rounds | Cost      |
| ------ | --------- |
| 1      | 0.001 ETH |
| 5      | 0.005 ETH |
| 10     | 0.01 ETH  |

---

# 💥 Combat Mechanics

The Solidity contract includes:

* Randomized combat
* Critical hit probability
* EXP progression
* Level-up system
* Class-based stat progression
* ETH monster rewards
* PvP combat
* Guild warfare
* Achievement progression
* Player death system
* Healing and revive mechanics

---

# 📜 Battle Logs

The frontend parses Solidity events emitted during combat and displays them in real time.

Example:

```txt
⚔️ Round 0
Player attacked and caused damage: 14

⚔️ Round 0
Critical hit caused damage: 32

⚔️ Round 1
Monster attacked and caused damage: 8

⚔️ Round 2
Monster defeated

🎉 Level Up!

🏆 Guild earned points
```

---

# 🏰 Medieval Fantasy UI

The frontend includes:

* Animated clouds
* Flying dragons
* Castle scenery
* Mountains and forests
* Medieval-inspired UI
* Responsive layout
* Fantasy RPG visual theme

---

# 🛠 Built With

* TypeScript
* Vite
* ethers.js
* Solidity
* Ethereum Sepolia
* HTML/CSS

---

# 🧙 Supported Wallets

The frontend supports injected EVM wallets such as:

* OKX Wallet
* MetaMask
* Rabby
* Coinbase Wallet
* Brave Wallet
* Phantom (EVM Mode)

---

# 🧪 Running Locally

## Clone Repository

```bash
git clone https://github.com/brunolcarli/EthereumSimpleRpgGame.git
cd simple-battle-rpg-frontend
```

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

---

# 📁 Project Structure

```txt
src/
 ├── contract.ts
 ├── main.ts
 └── style.css
```

---

# 🔮 Future Improvements

* 🎵 Sound effects
* 🗡️ Equipment system
* 🎒 Inventory system
* 🪙 ERC20 in-game currency
* 🖼️ NFT characters
* 🐲 Raid bosses
* 🎲 Chainlink VRF randomness
* 📱 Mobile UX improvements
* 🌎 Open world map
* ⚔️ PvP seasons
* 🏆 Seasonal guild rankings
* 🏰 Guild wars
* 👑 World bosses

---

# ⚠️ Disclaimer

This project was developed as a learning project focused on Solidity, Foundry, smart contract architecture, and Web3 frontend development.

The contracts have been deployed to public blockchain networks, including Arbitrum One Mainnet. However, the project is experimental in nature and should not be considered production-ready.

The randomness system currently relies on pseudo-random blockchain data and is not suitable for applications requiring provably fair randomness.

The smart contracts have not been audited and may contain bugs, vulnerabilities, or unintended behaviors.

Users should interact with the project at their own risk and avoid depositing significant amounts of funds.

For production-grade deployments, additional security reviews, extensive testing, and verifiable randomness solutions such as Chainlink VRF would be recommended.

---

# 📚 Learning Goals

This project explores:

* Solidity
* Smart Contracts
* ethers.js
* Wallet Integration
* Ethereum Transactions
* Event Parsing
* NFT Metadata
* IPFS Integration
* Guild Systems
* PvP Mechanics
* Web3 Frontend Architecture
* On-chain Game Design
* TypeScript Frontend Engineering

---

# 📄 License

MIT License

---

# 👨‍💻 Author

Beelzebruno — 2026

Built as a Solidity, Ethereum and Web3 learning project.
