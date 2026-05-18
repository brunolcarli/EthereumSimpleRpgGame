# ⚔️ Simple Battle RPG Frontend

A fantasy-themed Web3 RPG frontend built with TypeScript, Vite and ethers.js for interacting with an on-chain Solidity RPG smart contract deployed on Ethereum Sepolia.

Players can connect wallets, create characters, fight monsters, challenge other players, earn rewards, heal, revive characters and inspect all game data directly from the blockchain.

---

# 🌐 Live DApp

Demo DApp:

https://ethereum-simple-rpg-game.vercel.app/

---

# 📜 Smart Contract

## Sepolia Contract Address

```txt
0x494F4a2c19415b74a70cD8DD6927c309CCfb6723
```

---

## Etherscan

https://sepolia.etherscan.io/address/0x494f4a2c19415b74a70cd8dd6927c309ccfb6723

---

## Solidity Source Code

https://github.com/brunolcarli/simpleRPG

---

# ⚔️ Features

- 🔗 Connect EVM wallets
- 🧙 Register RPG characters
- ⚔️ PvE battles against monsters
- 🛡️ PvP battles against other players
- 📜 Real-time battle logs from Solidity events
- ❤️ Heal characters
- ☠️ Revive dead players
- 👾 View all enemies
- 🔍 Search any player by wallet address
- 📈 View your own character stats
- 💰 ETH reward mechanics
- 💥 Critical hit system
- 🏰 Animated medieval fantasy UI
- 🐉 Animated dragons and fantasy background
- 🌩️ Fully on-chain gameplay mechanics

---

# 🛠 Built With

- TypeScript
- Vite
- ethers.js
- Solidity
- Ethereum Sepolia
- HTML/CSS

---

# 🧙 Supported Wallets

The frontend supports injected EVM wallets such as:

- OKX Wallet
- MetaMask
- Rabby
- Coinbase Wallet
- Brave Wallet
- Phantom (EVM mode)

---

# 🎮 Game Systems

## Character Classes

| Class | Description |
|---|---|
| 🗡️ Warrior | High HP and defense |
| 🪄 Mage | High magic damage |
| 🏹 Ranger | Balanced fighter |

---

# 👾 Enemies

| Enemy | Description |
|---|---|
| 👺 Goblin | Weak starter enemy |
| 🪓 Orc | Physical fighter |
| 💀 Skeleton | Balanced undead |
| 🧟 Zombie | High HP |
| 🐺 Werewolf | Fast attacker |
| 🧝 Dark Elf | Magic enemy |
| 🦎 Great Lizard | Strong balanced monster |
| 🪨 Troll | Tank enemy |
| 🧚 Dark Fairy | Powerful magic enemy |
| 🐉 Dragon | Endgame boss |

---

# 💰 ETH Gameplay Mechanics

## Character Registration

```solidity
0.0001 ETH
```

---

## Battle Cost

Battle costs scale dynamically based on selected rounds.

```solidity
battleCost = commonPrice * rounds
```

Example:

| Rounds | Cost |
|---|---|
| 1 | 0.001 ETH |
| 5 | 0.005 ETH |
| 10 | 0.01 ETH |

---

## Player Actions

| Action | Cost |
|---|---|
| ❤️ Revive | commonPrice |
| 🧪 Heal | commonPrice |
| ⚔️ PvP Challenge | commonPrice × rounds |

---

# 💥 Combat Mechanics

The Solidity contract includes:

- Randomized combat
- Critical hit probability
- EXP system
- Level up system
- Class-based stat progression
- ETH drop rewards from monsters
- PvP combat
- Player death system
- Healing and revive mechanics

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
```

---

# 🏰 Medieval Fantasy UI

The frontend includes:

- Animated clouds
- Flying dragons
- Castle background
- Forest and mountain scenery
- Medieval-inspired UI theme
- Fantasy RPG styling

---

# 🧪 Running Locally

## Clone repository

```bash
git clone <your-repository-url>
cd simple-battle-rpg-frontend
```

---

## Install dependencies

```bash
npm install
```

---

## Start development server

```bash
npm run dev
```

---

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
 ├── style.css
```

---

# 🔮 Future Improvements

- 🎵 Sound effects
- 🗡️ Equipment system
- 🎒 Inventory system
- 🪙 ERC20 in-game currency
- 🖼️ NFT characters
- 🌎 Multiplayer matchmaking
- ⚡ PvP arena ranking
- 🐲 Raid bosses
- 🎲 Chainlink VRF randomness
- 📱 Mobile responsiveness improvements
- 🧭 Open-world map
- 🏆 Leaderboards

---

# ⚠️ Disclaimer

This project was created for educational and portfolio purposes.

The randomness system used in the smart contract is pseudo-random and is NOT secure for production-grade blockchain games.

This project is NOT audited.

---

# 📚 Learning Goals

This project explores:

- Smart contract integration
- ethers.js
- Wallet interaction
- Ethereum transactions
- Solidity events
- Event parsing
- On-chain game mechanics
- Web3 frontend architecture
- EVM development
- TypeScript frontend engineering

---

# 📄 License

MIT License

---

# 👨‍💻 Author

Beelzebruno — 2026

Built as a Solidity and blockchain learning project.