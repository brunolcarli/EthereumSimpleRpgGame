# ⚔️ Simple Battle RPG Frontend

Frontend application for interacting with the **Simple Battle RPG** Solidity smart contract deployed on Ethereum Sepolia.

This project allows players to connect their wallet, register characters, battle monsters, gain EXP, revive players, and inspect on-chain character data.

---

# 🌐 Live Smart Contract

Demo DApp on vercel: https://ethereum-simple-rpg-game.vercel.app/


## Sepolia Contract Address

```txt
0x7E68EF63Ea7Fd44691402002bFD3e28E420cf6F1
```

Solidity smart contract source code: https://github.com/brunolcarli/simpleRPG

## Etherscan

https://sepolia.etherscan.io/address/0x7e68ef63ea7fd44691402002bfd3e28e420cf6f1

---

# 🚀 Features

- 🔗 Connect EVM wallets
- 🧙 Register RPG characters
- ⚔️ Battle monsters on-chain
- 📜 Real-time battle logs
- 👾 View enemy list
- ❤️ Revive dead players
- 🔍 Search any player by wallet address
- 📈 View your own character stats
- 💰 ETH-based gameplay mechanics
- 🎮 Clean RPG-inspired UI

---

# 🛠 Built With

- TypeScript
- Vite
- ethers.js
- Solidity
- Ethereum Sepolia

---

# 🧙 Supported Wallets

The frontend supports injected EVM wallets such as:

- MetaMask
- Rabby
- Coinbase Wallet
- Brave Wallet
- Phantom (EVM mode)

---

# ⚔️ Game Features

## Character Classes

| Class | Description |
|---|---|
| 🗡️ Warrior | High HP and defense |
| 🪄 Mage | High magic damage |
| 🏹 Ranger | Balanced fighter |

---

## Enemies

The game includes several enemies:

| Enemy |
|---|
| 👺 Goblin |
| 🪓 Orc |
| 💀 Skeleton |
| 🧟 Zombie |
| 🐺 Werewolf |
| 🧝 Dark Elf |
| 🐉 Dragon |

---

# 💰 ETH Mechanics

## Character Registration

```solidity
0.0001 ETH
```

---

## Battle Cost

The battle price scales dynamically with the number of rounds selected.

```solidity
battlePrice = pricePerRound * rounds
```

Example:

| Rounds | Cost |
|---|---|
| 1 | 0.001 ETH |
| 5 | 0.005 ETH |
| 10 | 0.01 ETH |

---

## Revive Cost

```solidity
0.001 ETH
```

---

# 📜 Battle Logs

The frontend parses Solidity events emitted during combat and displays them in real time.

Example:

```txt
⚔️ Round 0
Player attacked and caused damage: 12

⚔️ Round 0
Monster attacked and caused damage: 6

⚔️ Round 1
Monster defeated
```

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

# 📁 Project Structure

```txt
src/
 ├── contract.ts
 ├── main.ts
 ├── style.css
```

---

# 🔮 Future Improvements

- 🎨 Animated combat UI
- 🎵 Sound effects
- 🗡️ Equipment system
- 🎒 Inventory system
- 🪙 ERC20 in-game currency
- 🖼️ NFT characters
- 🌎 Multiplayer systems
- ⚡ PvP arena
- 🐲 Raid bosses
- 🎲 Chainlink VRF randomness
- 📱 Mobile responsive improvements

---

# ⚠️ Disclaimer

This project was created for educational and portfolio purposes.

The randomness system used in the smart contract is pseudo-random and is NOT secure for production-grade blockchain games.

---

# 📚 Learning Goals

This project explores:

- Smart contract integration
- ethers.js
- Wallet interaction
- EVM transactions
- Event parsing
- On-chain game mechanics
- TypeScript frontend architecture
- Web3 development

---

# 📄 License

MIT License

---

# 👨‍💻 

Beelzebruno - 2026

Built as a blockchain and Solidity learning project.