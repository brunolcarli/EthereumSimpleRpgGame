import { ethers } from "ethers";
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  SEPOLIA_CHAIN_ID,
  REGISTER_PRICE,
  PRICE_PER_ROUND,
  REVIVE_PRICE,
} from "./contract";

import "./style.css";

declare global {
  interface Window {
    ethereum?: any;
    okxwallet?: any;
  }
}

let signer: ethers.JsonRpcSigner | null = null;
let contract: ethers.Contract | null = null;
let connectedAddress: string | null = null;

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <main class="container">
    <h1>⚔️ Simple Battle RPG</h1>
    <p class="subtitle">Sepolia On-chain RPG powered by Solidity</p>

    <section class="card">
      <h2>Wallet</h2>
      <button id="connectWallet">Connect Wallet</button>
      <p id="walletStatus">Not connected</p>
    </section>

    <section class="grid">
      <div class="card">
        <h2>Register Player</h2>

        <input id="playerName" placeholder="Player name" />

        <select id="classId">
          <option value="1">Warrior</option>
          <option value="2">Mage</option>
          <option value="3">Ranger</option>
        </select>

        <button id="registerPlayer">
          Register - ${REGISTER_PRICE} ETH
        </button>
      </div>

      <div class="card">
        <h2>My Character</h2>

        <button id="loadMyPlayer">
          Load My Character
        </button>

        <div id="myPlayerOutput" class="player-card"></div>
      </div>
    </section>

    <section class="card">
      <h2>Enemies</h2>

      <button id="loadEnemies">
        Load Enemies
      </button>

      <div id="enemiesOutput" class="enemy-list"></div>
    </section>

    <section class="card">
      <h2>Battle</h2>

      <label>Enemy</label>

      <select id="battleEnemyId">
        <option value="1">Goblin</option>
        <option value="2">Orc</option>
        <option value="3">Skeleton</option>
        <option value="4">Zombie</option>
        <option value="5">Werewolf</option>
        <option value="6">Dark Elf</option>
        <option value="7">Dragon</option>
      </select>

      <label>Rounds</label>

      <input
        id="battleRounds"
        type="number"
        min="1"
        value="1"
      />

      <button id="battle">
        Battle
      </button>

      <p id="battlePrice"></p>

      <pre id="battleOutput"></pre>
    </section>

    <section class="grid">
      <div class="card">
        <h2>Revive Character</h2>

        <input
          id="reviveAddress"
          placeholder="Target wallet address"
        />

        <button id="useMyAddressRevive">
          Use My Address
        </button>

        <button id="revive">
          Revive - ${REVIVE_PRICE} ETH
        </button>

        <pre id="reviveOutput"></pre>
      </div>

      <div class="card">
        <h2>Search Character</h2>

        <input
          id="searchAddress"
          placeholder="Wallet address"
        />

        <button id="useMyAddressSearch">
          Use My Address
        </button>

        <button id="searchPlayer">
          Search
        </button>

        <div id="searchOutput" class="player-card"></div>
      </div>
    </section>
  </main>
`;

function requireContract() {
  if (!contract || !signer || !connectedAddress) {
    throw new Error("Connect your wallet first.");
  }

  return contract;
}

function getInjectedProvider() {
  const win = window as any;

  // OKX sometimes injects here
  if (win.okxwallet) {
    console.log("Using OKX from window.okxwallet");
    return win.okxwallet;
  }

  // Some versions inject here
  if (win.okxwallet?.ethereum) {
    console.log("Using OKX from window.okxwallet.ethereum");
    return win.okxwallet.ethereum;
  }

  const ethereum = win.ethereum;

  if (!ethereum) {
    throw new Error("No wallet found");
  }

  const providers = ethereum.providers || [ethereum];

  console.log("Detected providers:", providers);

  const okxProvider = providers.find(
    (provider: any) =>
      provider.isOkxWallet ||
      provider.isOKExWallet ||
      provider.isOkx ||
      provider.isOKXWallet
  );

  if (okxProvider) {
    console.log("Using OKX from ethereum providers");
    return okxProvider;
  }

  throw new Error("OKX Wallet not found. Check if the OKX extension is installed and enabled for this site.");
}

async function connectWallet() {
  try {
    const injectedProvider = getInjectedProvider();

    const provider = new ethers.BrowserProvider(
      injectedProvider
    );

    await provider.send("eth_requestAccounts", []);

    try {
      await provider.send(
        "wallet_switchEthereumChain",
        [{ chainId: SEPOLIA_CHAIN_ID }]
      );
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await provider.send(
          "wallet_addEthereumChain",
          [
            {
              chainId: SEPOLIA_CHAIN_ID,
              chainName: "Sepolia",
              nativeCurrency: {
                name: "Sepolia ETH",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["https://rpc.sepolia.org"],
              blockExplorerUrls: [
                "https://sepolia.etherscan.io",
              ],
            },
          ]
        );
      }
    }

    signer = await provider.getSigner();

    connectedAddress = await signer.getAddress();

    contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    document.querySelector("#walletStatus")!.textContent =
    `Connected: ${connectedAddress} | Contract: ${CONTRACT_ADDRESS}`;
  } catch (error) {
    console.error(error);
  }
}

function formatPlayer(player: any) {
  return {
    level: player[0].toString(),
    name: player[1],
    exp: player[2].toString(),
    nextLevel: player[3].toString(),
    classId: player[4].toString(),
    class: player[5],
    maxHp: player[6].toString(),
    currentHp: player[7].toString(),
    atk: player[8].toString(),
    def: player[9].toString(),
    magic: player[10].toString(),
    isAlive: player[11],
  };
}

function formatEnemy(enemy: any) {
  return {
    id: enemy.id.toString(),
    name: enemy.name,
    hp: enemy.hp.toString(),
    atk: enemy.atk.toString(),
    def: enemy.def.toString(),
    magic: enemy.magic.toString(),
    isAlive: enemy.isAlive,
    exp: enemy.exp.toString(),
  };
}

async function registerPlayer() {
  try {
    const c = requireContract();

    const name =
      document.querySelector<HTMLInputElement>(
        "#playerName"
      )!.value;

    const classId = Number(
      document.querySelector<HTMLSelectElement>(
        "#classId"
      )!.value
    );

    if (!name) {
      alert("Enter a player name.");
      return;
    }

    const tx = await c.registerPlayer(
      name,
      classId,
      {
        value: ethers.parseEther(
          REGISTER_PRICE
        ),
      }
    );

    await tx.wait();

    alert("Player registered!");

    await loadMyPlayer();

  } catch (error: any) {
    alert(error.message);
  }
}

async function loadMyPlayer() {
  try {
    const c = requireContract();

    console.log("Loading player from wallet:", connectedAddress);
    console.log("Contract address:", CONTRACT_ADDRESS);

    const player = await c.players(
      connectedAddress
    );

    const data = formatPlayer(player);

    const container =
      document.querySelector<HTMLDivElement>(
        "#myPlayerOutput"
      )!;

    const classEmoji =
      data.class === "Warrior"
        ? "🗡️"
        : data.class === "Mage"
        ? "🧙"
        : "🏹";

    container.innerHTML = `
      <h3>${data.name || "Unnamed Player"}</h3>

      <p>${classEmoji} <strong>Class:</strong> ${data.class}</p>
      <p>⭐ <strong>Level:</strong> ${data.level}</p>
      <p>📈 <strong>EXP:</strong> ${data.exp} / ${data.nextLevel}</p>

      <hr />

      <p>❤️ <strong>HP:</strong> ${data.currentHp} / ${data.maxHp}</p>
      <p>⚔️ <strong>ATK:</strong> ${data.atk}</p>
      <p>🛡️ <strong>DEF:</strong> ${data.def}</p>
      <p>🪄 <strong>MAGIC:</strong> ${data.magic}</p>

      <hr />

      <p><strong>Status:</strong> ${
        data.isAlive
          ? "🟢 Alive"
          : "🔴 Dead"
      }</p>

      <p><strong>Wallet:</strong> ${connectedAddress}</p>
    `;
  } catch (error: any) {
    alert(error.message);
  }
}

async function loadEnemies() {
  try {
    const c = requireContract();

    const enemyEmojiMap: Record<
      string,
      string
    > = {
      Goblin: "👺",
      Orc: "🪓",
      Skeleton: "💀",
      Zombie: "🧟",
      Werewolf: "🐺",
      "Dark Elf": "🧝",
      Dragon: "🐉",
    };

    const container =
      document.querySelector<HTMLDivElement>(
        "#enemiesOutput"
      )!;

    container.innerHTML = "";

    for (let i = 1; i <= 7; i++) {
      const enemy = await c.enemies(i);

      const data = formatEnemy(enemy);

      const div =
        document.createElement("div");

      div.className = "enemy-card";

      div.innerHTML = `
        <h3>
          ${enemyEmojiMap[data.name] || "👾"}
          ${data.name}
        </h3>

        <p>❤️ HP: ${data.hp}</p>
        <p>⚔️ ATK: ${data.atk}</p>
        <p>🛡️ DEF: ${data.def}</p>
        <p>🪄 MAGIC: ${data.magic}</p>
        <p>📈 EXP: ${data.exp}</p>
      `;

      container.appendChild(div);
    }
  } catch (error: any) {
    alert(error.message);
  }
}

function updateBattlePrice() {
  const rounds = Number(
    document.querySelector<HTMLInputElement>(
      "#battleRounds"
    )!.value || "0"
  );

  const total =
    Number(PRICE_PER_ROUND) * rounds;

  document.querySelector(
    "#battlePrice"
  )!.textContent =
    `💰 Battle cost: ${total.toFixed(
      4
    )} ETH`;
}

async function battle() {
  try {
    const c = requireContract();

    const enemyId = Number(
      document.querySelector<HTMLSelectElement>(
        "#battleEnemyId"
      )!.value
    );

    const rounds = Number(
      document.querySelector<HTMLInputElement>(
        "#battleRounds"
      )!.value
    );

    const output =
      document.querySelector(
        "#battleOutput"
      )!;

    output.textContent =
      "⏳ Waiting transaction confirmation...\n";

    const pricePerRound =
      await c.pricePerRound();

    const battleCost =
      pricePerRound * BigInt(rounds);

    const tx = await c.battle(
      enemyId,
      rounds,
      {
        value: battleCost,
      }
    );

    output.textContent +=
      `📦 TX Sent: ${tx.hash}\n\n`;

    const receipt = await tx.wait();

    output.textContent +=
      "✅ Battle confirmed!\n\n";

    const battleLogs: string[] = [];

    for (const log of receipt.logs) {
      try {
        const parsed =
          c.interface.parseLog(log);

        if (!parsed) continue;

        if (
          parsed.name === "battleLog"
        ) {
          const round =
            parsed.args.round;

          const message =
            parsed.args.message;

          const value =
            parsed.args.value;

          battleLogs.push(
            `⚔️ Round ${round}\n${message} ${value}\n`
          );
        }
      } catch {
        // ignore unrelated logs
      }
    }

    if (battleLogs.length === 0) {
      output.textContent +=
        "No battle logs found.";
    } else {
      output.textContent +=
        battleLogs.join("\n");
    }

    await loadMyPlayer();
  } catch (error: any) {
    console.error(error);
    alert(error.message);
  }
}

async function revive() {
  try {
    const c = requireContract();

    const target =
      document.querySelector<HTMLInputElement>(
        "#reviveAddress"
      )!.value;

    if (!ethers.isAddress(target)) {
      alert("Invalid address.");
      return;
    }

    const tx = await c.revive(target, {
      value: ethers.parseEther(
        REVIVE_PRICE
      ),
    });

    await tx.wait();

    document.querySelector(
      "#reviveOutput"
    )!.textContent =
      `❤️ Revived: ${target}`;
  } catch (error: any) {
    alert(error.message);
  }
}

async function searchPlayer() {
  try {
    const c = requireContract();

    const address =
      document.querySelector<HTMLInputElement>(
        "#searchAddress"
      )!.value;

    if (!ethers.isAddress(address)) {
      alert("Invalid address.");
      return;
    }

    const player =
      await c.players(address);

    const data = formatPlayer(player);

    const container =
      document.querySelector<HTMLDivElement>(
        "#searchOutput"
      )!;

    const classEmoji =
      data.class === "Warrior"
        ? "🗡️"
        : data.class === "Mage"
        ? "🧙"
        : "🏹";

    container.innerHTML = `
      <h3>${data.name || "Unnamed Player"}</h3>

      <p>${classEmoji} <strong>Class:</strong> ${data.class}</p>
      <p>⭐ <strong>Level:</strong> ${data.level}</p>
      <p>📈 <strong>EXP:</strong> ${data.exp} / ${data.nextLevel}</p>

      <hr />

      <p>❤️ <strong>HP:</strong> ${data.currentHp} / ${data.maxHp}</p>
      <p>⚔️ <strong>ATK:</strong> ${data.atk}</p>
      <p>🛡️ <strong>DEF:</strong> ${data.def}</p>
      <p>🪄 <strong>MAGIC:</strong> ${data.magic}</p>

      <hr />

      <p><strong>Status:</strong> ${
        data.isAlive
          ? "🟢 Alive"
          : "🔴 Dead"
      }</p>

      <p><strong>Wallet:</strong> ${address}</p>
    `;
  } catch (error: any) {
    alert(error.message);
  }
}

document
  .querySelector("#connectWallet")!
  .addEventListener(
    "click",
    connectWallet
  );

document
  .querySelector("#registerPlayer")!
  .addEventListener(
    "click",
    registerPlayer
  );

document
  .querySelector("#loadMyPlayer")!
  .addEventListener(
    "click",
    loadMyPlayer
  );

document
  .querySelector("#loadEnemies")!
  .addEventListener(
    "click",
    loadEnemies
  );

document
  .querySelector("#battle")!
  .addEventListener(
    "click",
    battle
  );

document
  .querySelector("#revive")!
  .addEventListener(
    "click",
    revive
  );

document
  .querySelector("#searchPlayer")!
  .addEventListener(
    "click",
    searchPlayer
  );

document
  .querySelector("#battleRounds")!
  .addEventListener(
    "input",
    updateBattlePrice
  );

document
  .querySelector(
    "#useMyAddressRevive"
  )!
  .addEventListener("click", () => {
    if (connectedAddress) {
      document.querySelector<HTMLInputElement>(
        "#reviveAddress"
      )!.value = connectedAddress;
    }
  });

document
  .querySelector(
    "#useMyAddressSearch"
  )!
  .addEventListener("click", () => {
    if (connectedAddress) {
      document.querySelector<HTMLInputElement>(
        "#searchAddress"
      )!.value = connectedAddress;
    }
  });

updateBattlePrice();