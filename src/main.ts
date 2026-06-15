import { ethers } from "ethers";

import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  SEPOLIA_CHAIN_ID,
  REGISTER_PRICE,
  CREATE_GUILD_PRICE,
} from "./contract";

import "./style.css";

declare global {
  interface Window {
    ethereum?: any;
    okxwallet?: any;
  }
}

function formatGuild(guild: any) {
  return {
    id: guild[0].toString(),
    name: guild[1],
    guildOwner: guild[2],
    membersCount: guild[3].toString(),
    points: guild[4].toString(),
    exists: guild[5],
  };
}

const ACHIEVEMENTS = [
  { id: 1, name: "Goblin Slayer", enemyId: 1 },
  { id: 2, name: "Orc Slayer", enemyId: 2 },
  { id: 3, name: "Skeleton Slayer", enemyId: 3 },
  { id: 4, name: "Zombie Slayer", enemyId: 4 },
  { id: 5, name: "Werewolf Slayer", enemyId: 5 },
  { id: 6, name: "Dark Elf Slayer", enemyId: 6 },
  { id: 7, name: "Great Lizard Slayer", enemyId: 7 },
  { id: 8, name: "Troll Slayer", enemyId: 8 },
  { id: 9, name: "Dark Fairy Slayer", enemyId: 9 },
  { id: 10, name: "Dragon Slayer", enemyId: 10 },
  { id: 100, name: "PVP Master", enemyId: null },
];

async function createGuild() {
  try {
    const c = requireContract();

    const name = document.querySelector<HTMLInputElement>("#guildName")!.value;

    if (!name) {
      alert("Enter a guild name.");
      return;
    }

    const tx = await c.createGuild(name, {
      value: ethers.parseEther(CREATE_GUILD_PRICE),
    });

    await tx.wait();

    alert("Guild created!");

    await loadGuilds();
    await loadTopGuilds();
  } catch (error: any) {
    console.error(error);
    alert(error.message);
  }
}

async function joinGuild() {
  try {
    const c = requireContract();

    const guildId = Number(
      document.querySelector<HTMLInputElement>("#joinGuildId")!.value
    );

    if (guildId <= 0) {
      alert("Invalid guild ID.");
      return;
    }

    const tx = await c.joinGuild(guildId);
    await tx.wait();

    alert("Joined guild!");

    await loadMyPlayer();
    await loadGuilds();
  } catch (error: any) {
    console.error(error);
    alert(error.message);
  }
}

async function leaveGuild() {
  try {
    const c = requireContract();

    const tx = await c.leaveGuild();
    await tx.wait();

    alert("Left guild!");

    await loadMyPlayer();
    await loadGuilds();
  } catch (error: any) {
    console.error(error);
    alert(error.message);
  }
}

async function loadGuilds() {
  try {
    const readProvider = new ethers.JsonRpcProvider(READ_RPC);

    const readContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      readProvider
    );

    const guilds = await readContract.getGuilds(0, 50);

    const output = document.querySelector<HTMLDivElement>("#guildsOutput")!;

    if (!guilds.length) {
      output.innerHTML = "<p>No guilds created yet.</p>";
      return;
    }

    output.innerHTML = guilds
      .map((guild: any) => {
        const data = formatGuild(guild);

        return `
          <div class="guild-card">
            <h3>#${data.id} - ${data.name}</h3>
            <p>👑 Owner: <code>${data.guildOwner}</code></p>
            <p>👥 Members: ${data.membersCount}</p>
            <p>🏆 Points: ${data.points}</p>
          </div>
        `;
      })
      .join("");
  } catch (error: any) {
    console.error(error);
    alert(error.message);
  }
}

async function loadTopGuilds() {
  console.log("LOAD TOP GUILDS CLICKED");
  try {
    const readProvider = new ethers.JsonRpcProvider(READ_RPC);

    const readContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      readProvider
    );

    const topGuilds = await readContract.getTopGuilds();

    const output =
      document.querySelector<HTMLDivElement>("#topGuildsOutput")!;

    let activeGuilds = topGuilds
      .map((guild: any) => formatGuild(guild))
      .filter((guild: any) => guild.exists);

    if (!activeGuilds.length) {
      const allGuilds = await readContract.getGuilds(0, 50);

      activeGuilds = allGuilds
        .map((guild: any) => formatGuild(guild))
        .filter((guild: any) => guild.exists)
        .sort((a: any, b: any) => Number(b.points) - Number(a.points))
        .slice(0, 5);
    }

    if (!activeGuilds.length) {
      output.innerHTML = "<p>No guilds found.</p>";
      return;
    }

    output.innerHTML = `
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Guild</th>
            <th>Members</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          ${activeGuilds
            .map(
              (guild: any, index: number) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${guild.name}</td>
                  <td>${guild.membersCount}</td>
                  <td>${guild.points}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    `;
  } catch (error: any) {
    console.error(error);
    alert(error.message);
  }
}

async function loadAchievements() {
  try {
    if (!connectedAddress) {
      throw new Error("Connect your wallet first.");
    }

    const readProvider = new ethers.JsonRpcProvider(READ_RPC);

    const readContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      readProvider
    );

    const output =
      document.querySelector<HTMLDivElement>("#achievementsOutput")!;

    const rows = [];

    for (const achievement of ACHIEVEMENTS) {
      const claimed = await readContract.hasAchievement(
        connectedAddress,
        achievement.id
      );

      let progress = "0";
      let requirement = "100";

      if (achievement.enemyId !== null) {
        progress = (
          await readContract.monsterSlayeds(
            connectedAddress,
            achievement.enemyId
          )
        ).toString();

        requirement = (
          await readContract.achievementRequirement(achievement.enemyId)
        ).toString();
      } else {
        progress = (
          await readContract.uniquePlayersSlayed(connectedAddress)
        ).toString();

        requirement = (
          await readContract.PLAYER_SLAYER_REQUIRED_KILLS()
        ).toString();
      }

      rows.push(`
        <div class="achievement-card">
          <h3>${claimed ? "✅" : "🎖️"} ${achievement.name}</h3>
          <p>Progress: ${progress} / ${requirement}</p>
          <button
            class="claim-achievement"
            data-achievement-id="${achievement.id}"
            ${claimed ? "disabled" : ""}
          >
            ${claimed ? "Claimed" : "Claim NFT"}
          </button>
        </div>
      `);
    }

    output.innerHTML = rows.join("");

    document
      .querySelectorAll<HTMLButtonElement>(".claim-achievement")
      .forEach((button) => {
        button.addEventListener("click", async () => {
          const achievementId = Number(button.dataset.achievementId);

          await claimAchievement(achievementId);
        });
      });
  } catch (error: any) {
    console.error(error);
    alert(error.message);
  }
}

async function claimAchievement(achievementId: number) {
  try {
    const c = requireContract();

    const tx = await c.claimAchievement(achievementId);

    alert(`Achievement claim TX sent: ${tx.hash}`);

    await tx.wait();

    alert("Achievement NFT claimed!");

    await loadAchievements();
  } catch (error: any) {
    console.error(error);
    alert(error.message);
  }
}

async function getUniquePlayerWalletsFromEtherscan(): Promise<string[]> {
  const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY;

  const url =
    `https://api.etherscan.io/v2/api` +
    `?chainid=11155111` +
    `&module=account` +
    `&action=txlist` +
    `&address=${CONTRACT_ADDRESS}` +
    `&startblock=0` +
    `&endblock=99999999` +
    `&page=1` +
    `&offset=1000` +
    `&sort=asc` +
    `&apikey=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== "1") {
    throw new Error(data.message || "Could not fetch Etherscan transactions");
  }

  const wallets = Array.from(
    new Set(
      data.result
        .filter((tx: any) => {
          return (
            tx.to?.toLowerCase() === CONTRACT_ADDRESS.toLowerCase() &&
            tx.isError === "0"
          );
        })
        .map((tx: any) => tx.from.toLowerCase())
    )
  );

  console.log("Unique player wallets:", wallets);

  return wallets as string[];
}

let signer: ethers.JsonRpcSigner | null = null;
let contract: ethers.Contract | null = null;
let connectedAddress: string | null = null;

const READ_RPC = "https://ethereum-sepolia-rpc.publicnode.com";

const app = document.querySelector<HTMLDivElement>("#app")!;

app.innerHTML = `
  <main class="container">

    <div class="fantasy-bg">
      <div class="sky"></div>
      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
      <div class="mountains"></div>
      <div class="castle">🏰</div>
      <div class="forest"></div>
      <div class="dragon dragon-1">🐉</div>
      <div class="dragon dragon-2">🐲</div>
    </div>

    <h1>⚔️ Simple Battle RPG</h1>
    <p class="subtitle">Sepolia On-chain RPG powered by Solidity</p>

    <section class="card">
      <h2>Wallet</h2>

      <button id="connectWallet">
        Connect Wallet
      </button>

      <p id="walletStatus">
        Not connected
      </p>
    </section>

    <section class="grid">
      <div class="card">
        <h2>Register Player</h2>

        <input
          id="playerName"
          placeholder="Player name"
        />

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

        <div
          id="myPlayerOutput"
          class="player-card"
        ></div>
      </div>
    </section>

    <section class="card">
      <h2>Enemies</h2>

      <button id="loadEnemies">
        Load Enemies
      </button>

      <div
        id="enemiesOutput"
        class="enemy-list"
      ></div>
    </section>

    <section class="card">
      <h2>Battle</h2>

      <label>Enemy</label>

      <select id="battleEnemyId">
        <option value="1">👺 Goblin</option>
        <option value="2">🪓 Orc</option>
        <option value="3">💀 Skeleton</option>
        <option value="4">🧟 Zombie</option>
        <option value="5">🐺 Werewolf</option>
        <option value="6">🧝 Dark Elf</option>
        <option value="7">🦎 Great Lizard</option>
        <option value="8">🪨 Troll</option>
        <option value="9">🧚 Dark Fairy</option>
        <option value="10">🐉 Dragon</option>
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
          Revive
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

        <div
          id="searchOutput"
          class="player-card"
        ></div>
      </div>

      <div class="card">
      <h2>Heal Character</h2>
      <input id="healAddress" placeholder="Target wallet address" />
      <button id="useMyAddressHeal">Use My Address</button>
      <button id="heal">Heal</button>
      <pre id="healOutput"></pre>
    </div>

    <div class="card">
      <h2>PvP Challenge</h2>
      <input id="challengeAddress" placeholder="Target player wallet" />
      <input id="challengeRounds" type="number" min="1" value="1" />
      <button id="challengePlayer">Challenge Player</button>
      <pre id="challengeOutput"></pre>
    </div>

    <section class="card">
      <h2>🏆 Top Players</h2>
      <button id="loadLeaderboard">Load Top Players</button>
      <div id="leaderboardOutput"></div>
    </section>

    <section class="grid guild-grid">
      <div class="card">
        <h2>🏰 Guilds</h2>

        <input id="guildName" placeholder="Guild name" />

        <button id="createGuild">
          Create Guild - ${CREATE_GUILD_PRICE} ETH
        </button>

        <input id="joinGuildId" type="number" min="1" placeholder="Guild ID" />

        <button id="joinGuild">Join Guild</button>
        <button id="leaveGuild">Leave Guild</button>
        <button id="loadGuilds">Load Guilds</button>

        <div id="guildsOutput"></div>
      </div>

      <div class="card">
        <h2>🏆 Top Guilds</h2>

        <button id="loadTopGuilds">Load Top Guilds</button>

        <div id="topGuildsOutput"></div>
      </div>
    </section>

    <section class="card">
      <h2>🎖️ Achievements</h2>

      <button id="loadAchievements">Load My Achievements</button>

      <div id="achievementsOutput"></div>
    </section>

    </section>
  </main>
`;

type LeaderboardPlayer = {
  wallet: string;
  name: string;
  class: string;
  level: number;
};

async function loadLeaderboard() {
  try {
    const output =
      document.querySelector<HTMLDivElement>("#leaderboardOutput")!;

    output.innerHTML = "⏳ Loading leaderboard...";

    const wallets =
      (await getUniquePlayerWalletsFromEtherscan()) as string[];

    const readProvider = new ethers.JsonRpcProvider(READ_RPC);

    const readContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      readProvider
    );

    const players: LeaderboardPlayer[] = [];

    for (const wallet of wallets) {
      const player = await readContract.players(wallet);
      const data = formatPlayer(player);

      if (Number(data.level) > 0) {
        players.push({
          wallet: String(wallet),
          name: data.name,
          class: data.class,
          level: Number(data.level),
        });
      }
    }

    const topPlayers = players
      .sort((a, b) => b.level - a.level)
      .slice(0, 10);

    output.innerHTML = `
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Hero</th>
            <th>Class</th>
            <th>Level</th>
            <th>Wallet</th>
          </tr>
        </thead>
        <tbody>
          ${topPlayers
            .map(
              (player, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${player.name}</td>
                  <td>${player.class}</td>
                  <td>${player.level}</td>
                  <td class="wallet-cell">
                  <code>${player.wallet}</code>
                  <button
                    class="copy-wallet-btn"
                    data-wallet="${player.wallet}"
                  >
                    Copy
                  </button>
                </td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    `;

    document
    .querySelectorAll<HTMLButtonElement>(".copy-wallet-btn")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        const wallet = button.dataset.wallet;

        if (!wallet) return;

        await navigator.clipboard.writeText(wallet);

        button.textContent = "Copied!";

        setTimeout(() => {
          button.textContent = "Copy";
        }, 1200);
      });
    });
  } catch (error: any) {
    console.error(error);
    alert(error.message);
  }
}



function requireContract() {
  if (!contract || !signer || !connectedAddress) {
    throw new Error(
      "Connect your wallet first."
    );
  }

  return contract;
}

function getInjectedProvider() {
  const win = window as any;

  if (win.okxwallet) {
    console.log(
      "Using OKX from window.okxwallet"
    );

    return win.okxwallet;
  }

  if (win.okxwallet?.ethereum) {
    console.log(
      "Using OKX from window.okxwallet.ethereum"
    );

    return win.okxwallet.ethereum;
  }

  const ethereum = win.ethereum;

  if (!ethereum) {
    throw new Error("No wallet found");
  }

  const providers =
    ethereum.providers || [ethereum];

  console.log(
    "Detected providers:",
    providers
  );

  const okxProvider = providers.find(
    (provider: any) =>
      provider.isOkxWallet ||
      provider.isOKExWallet ||
      provider.isOkx ||
      provider.isOKXWallet
  );

  if (okxProvider) {
    console.log(
      "Using OKX from ethereum providers"
    );

    return okxProvider;
  }

  throw new Error(
    "OKX Wallet not found."
  );
}

async function connectWallet() {
  try {
    const injectedProvider =
      getInjectedProvider();

    const provider =
      new ethers.BrowserProvider(
        injectedProvider
      );

    await provider.send(
      "eth_requestAccounts",
      []
    );

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
              chainId:
                SEPOLIA_CHAIN_ID,
              chainName: "Sepolia",
              nativeCurrency: {
                name: "Sepolia ETH",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: [
                "https://rpc.sepolia.org",
              ],
              blockExplorerUrls: [
                "https://sepolia.etherscan.io",
              ],
            },
          ]
        );
      }
    }

    signer = await provider.getSigner();

    connectedAddress =
      await signer.getAddress();

    contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    document.querySelector(
      "#walletStatus"
    )!.textContent =
      `Connected: ${connectedAddress} | Contract: ${CONTRACT_ADDRESS}`;
  } catch (error) {
    console.error(error);
  }
}

async function heal() {
  try {
    const c = requireContract();

    const target =
      document.querySelector<HTMLInputElement>(
        "#healAddress"
      )!.value;

    if (!ethers.isAddress(target)) {
      alert("Invalid address.");
      return;
    }

    const commonPrice =
      await c.COMMON_PRICE();

    const tx = await c.heal(target, {
      value: commonPrice,
    });

    document.querySelector(
      "#healOutput"
    )!.textContent =
      `⏳ Heal TX sent: ${tx.hash}`;

    const readProvider =
      new ethers.JsonRpcProvider(READ_RPC);

    const receipt =
      await readProvider.waitForTransaction(
        tx.hash,
        1,
        120000
      );

    if (!receipt) {
      document.querySelector(
        "#healOutput"
      )!.textContent =
        "❌ Heal confirmation timeout.";
      return;
    }

    document.querySelector(
      "#healOutput"
    )!.textContent =
      `🧪 Healed: ${target}`;

    await loadMyPlayer();
  } catch (error: any) {
    console.error(error);
    alert(error.message);
  }
}

async function challengePlayer() {
  try {
    const c = requireContract();

    const target = document.querySelector<HTMLInputElement>("#challengeAddress")!.value;
    const rounds = Number(
      document.querySelector<HTMLInputElement>("#challengeRounds")!.value
    );

    if (rounds <= 0) {
      alert("Rounds must be greater than zero.");
      return;
    }

    const output = document.querySelector("#challengeOutput")!;

    if (!ethers.isAddress(target)) {
      alert("Invalid target address.");
      return;
    }

    output.textContent = "⏳ Sending PvP challenge...\n";

    const commonPrice = await c.COMMON_PRICE();
    const battleCost = commonPrice * BigInt(rounds);

    const tx = await c.challengePlayer(target, rounds, {
      value: battleCost,
    });

    output.textContent += `📦 TX Sent: ${tx.hash}\n\n`;
    output.textContent += "⏳ Waiting confirmation from Sepolia RPC...\n\n";

    const readProvider = new ethers.JsonRpcProvider(READ_RPC);
    const receipt = await readProvider.waitForTransaction(tx.hash, 1, 120000);

    if (!receipt) {
      output.textContent += "❌ Transaction confirmation timeout.";
      return;
    }

    output.textContent += "✅ PvP battle confirmed!\n\n";

    const iface = new ethers.Interface(CONTRACT_ABI);
    const battleLogs: string[] = [];

    for (const log of receipt.logs) {
      try {
        const parsed = iface.parseLog({
          topics: log.topics,
          data: log.data,
        });

        if (parsed?.name === "battleLog") {
          battleLogs.push(
            `⚔️ Round ${parsed.args[0].toString()}\n${parsed.args[1]} ${parsed.args[2].toString()}\n`
          );
        }
      } catch {
        // ignore unrelated logs
      }
    }

    output.textContent += battleLogs.length
      ? battleLogs.join("\n")
      : "No battle logs found.";

    await loadMyPlayer();
  } catch (error: any) {
    console.error(error);
    alert(error.message);
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
    id: enemy[0].toString(),
    name: enemy[1],
    hp: enemy[2].toString(),
    atk: enemy[3].toString(),
    def: enemy[4].toString(),
    magic: enemy[5].toString(),
    isAlive: enemy[6],
    exp: enemy[7].toString(),
    gold: enemy[8].toString(),
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

    const tx =
      await c.registerPlayer(
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
    console.error(error);
    alert(error.message);
  }
}

async function loadMyPlayer() {
  try {
    if (!connectedAddress) {
      throw new Error(
        "Connect your wallet first."
      );
    }

    const readProvider =
      new ethers.JsonRpcProvider(
        READ_RPC
      );

    const readContract =
      new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        readProvider
      );

    const player =
      await readContract.players(
        connectedAddress
      );

    console.log(
      "Raw player result:",
      player
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

      <p>
        <strong>Status:</strong>
        ${
          data.isAlive
            ? "🟢 Alive"
            : "🔴 Dead"
        }
      </p>

      <p>
        <strong>Wallet:</strong>
        ${connectedAddress}
      </p>
    `;
  } catch (error: any) {
    console.error(error);
    alert(error.message);
  }
}

async function loadEnemies() {
  try {
    const readProvider = new ethers.JsonRpcProvider(READ_RPC);

    const readContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      readProvider
    );

    const enemyEmojiMap: Record<string, string> = {
      Goblin: "👺",
      Orc: "🪓",
      Skeleton: "💀",
      Zombie: "🧟",
      Werewolf: "🐺",
      "Dark Elf": "🧝",
      "Great Lizard": "🦎",
      Troll: "🪨",
      "Dark Fairy": "🧚",
      Dragon: "🐉",
    };

    const container = document.querySelector<HTMLDivElement>(
      "#enemiesOutput"
    )!;

    // Prevent duplicated cards
    container.replaceChildren();

    const enemyIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    for (const enemyId of enemyIds) {
      const enemy = await readContract.enemies(enemyId);
      const data = formatEnemy(enemy);

      const div = document.createElement("div");
      div.className = "enemy-card";
      div.dataset.enemyId = data.id;

      div.innerHTML = `
        <h3>${enemyEmojiMap[data.name] || "👾"} ${data.name}</h3>

        <p>❤️ HP: ${data.hp}</p>
        <p>⚔️ ATK: ${data.atk}</p>
        <p>🛡️ DEF: ${data.def}</p>
        <p>🪄 MAGIC: ${data.magic}</p>
        <p>📈 EXP: ${data.exp}</p>
        <p>💰 GOLD: ${ethers.formatEther(data.gold)} ETH</p>
      `;

      container.appendChild(div);
    }
  } catch (error: any) {
    console.error(error);
    alert(error.message);
  }
}
async function updateBattlePrice() {
  try {
    const readProvider = new ethers.JsonRpcProvider(READ_RPC);

    const readContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      readProvider
    );

    const rounds = Number(
      document.querySelector<HTMLInputElement>("#battleRounds")!.value || "0"
    );

    const commonPrice = await readContract.COMMON_PRICE();
    const totalWei = commonPrice * BigInt(rounds);

    document.querySelector("#battlePrice")!.textContent =
      `💰 Battle cost: ${ethers.formatEther(totalWei)} ETH`;
  } catch (error) {
    console.error(error);
  }
}


async function battle() {
  try {
    const c = requireContract();

    const enemyId = Number(
      document.querySelector<HTMLSelectElement>("#battleEnemyId")!.value
    );

    const rounds = Number(
      document.querySelector<HTMLInputElement>("#battleRounds")!.value
    );

    const output = document.querySelector("#battleOutput")!;

    output.textContent = "⏳ Sending battle transaction...\n";

    const commonPrice = await c.COMMON_PRICE();
    const battleCost = commonPrice * BigInt(rounds);

    const tx = await c.battle(enemyId, rounds, {
      value: battleCost,
    });

    output.textContent += `📦 TX Sent: ${tx.hash}\n\n`;
    output.textContent += "⏳ Waiting confirmation from Sepolia RPC...\n\n";

    const readProvider = new ethers.JsonRpcProvider(READ_RPC);

    const receipt = await readProvider.waitForTransaction(tx.hash, 1, 120000);

    console.log("Receipt from public RPC:", receipt);

    if (!receipt) {
      output.textContent += "❌ Transaction confirmation timeout.";
      return;
    }

    output.textContent += "✅ Battle confirmed!\n\n";

    const iface = new ethers.Interface(CONTRACT_ABI);

    const battleLogs: string[] = [];

    console.log("Receipt logs:", receipt.logs);

    for (const log of receipt.logs) {
      try {
        console.log("Raw log:", log);

        const parsed = iface.parseLog({
          topics: log.topics,
          data: log.data,
        });

        console.log("Parsed log:", parsed);

        if (parsed?.name === "battleLog") {
          const round = parsed.args[0].toString();
          const message = parsed.args[1];
          const value = parsed.args[2].toString();

          const line = `⚔️ Round ${round}\n${message} ${value}\n`;

          console.log("Rendered battle log:", line);

          battleLogs.push(line);
        }
      } catch (err) {
        console.log("Ignored non-battle log:", err);
      }
    }

    output.textContent += battleLogs.length
      ? battleLogs.join("\n")
      : "No battle logs found.";

    await loadMyPlayer();
  } catch (error: any) {
    console.error("Battle error:", error);
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

    const commonPrice = await c.COMMON_PRICE();

    const tx = await c.revive(target, {
      value: commonPrice,
    });

    document.querySelector(
      "#reviveOutput"
    )!.textContent =
      `⏳ Revive TX sent: ${tx.hash}`;

    const readProvider =
      new ethers.JsonRpcProvider(READ_RPC);

    const receipt =
      await readProvider.waitForTransaction(
        tx.hash,
        1,
        120000
      );

    if (!receipt) {
      document.querySelector(
        "#reviveOutput"
      )!.textContent =
        "❌ Revive confirmation timeout.";
      return;
    }

    document.querySelector(
      "#reviveOutput"
    )!.textContent =
      `❤️ Revived: ${target}`;

    await loadMyPlayer();
  } catch (error: any) {
    console.error(error);
    alert(error.message);
  }
}

async function searchPlayer() {
  try {
    const address =
      document.querySelector<HTMLInputElement>(
        "#searchAddress"
      )!.value;

    if (
      !ethers.isAddress(address)
    ) {
      alert("Invalid address.");
      return;
    }

    const readProvider =
      new ethers.JsonRpcProvider(
        READ_RPC
      );

    const readContract =
      new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        readProvider
      );

    const player =
      await readContract.players(
        address
      );

    const data =
      formatPlayer(player);

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

      <p>
        <strong>Status:</strong>
        ${
          data.isAlive
            ? "🟢 Alive"
            : "🔴 Dead"
        }
      </p>

      <p>
        <strong>Wallet:</strong>
        ${address}
      </p>
    `;
  } catch (error: any) {
    console.error(error);
    alert(error.message);
  }
}

document
  .querySelector(
    "#connectWallet"
  )!
  .addEventListener(
    "click",
    connectWallet
  );

document
  .querySelector(
    "#registerPlayer"
  )!
  .addEventListener(
    "click",
    registerPlayer
  );

document
  .querySelector(
    "#loadMyPlayer"
  )!
  .addEventListener(
    "click",
    loadMyPlayer
  );

document
  .querySelector(
    "#loadEnemies"
  )!
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
  .querySelector(
    "#searchPlayer"
  )!
  .addEventListener(
    "click",
    searchPlayer
  );

document
  .querySelector(
    "#battleRounds"
  )!
  .addEventListener(
    "input",
    updateBattlePrice
  );

document
  .querySelector(
    "#useMyAddressRevive"
  )!
  .addEventListener(
    "click",
    () => {
      if (connectedAddress) {
        document.querySelector<HTMLInputElement>(
          "#reviveAddress"
        )!.value =
          connectedAddress;
      }
    }
  );

document
  .querySelector(
    "#useMyAddressSearch"
  )!
  .addEventListener(
    "click",
    () => {
      if (connectedAddress) {
        document.querySelector<HTMLInputElement>(
          "#searchAddress"
        )!.value =
          connectedAddress;
      }
    }
  );

document
  .querySelector("#heal")!
  .addEventListener("click", heal);

document
  .querySelector("#challengePlayer")!
  .addEventListener("click", challengePlayer);

document
  .querySelector("#useMyAddressHeal")!
  .addEventListener("click", () => {
    if (connectedAddress) {
      document.querySelector<HTMLInputElement>("#healAddress")!.value =
        connectedAddress;
    }
  });

document
  .querySelector("#createGuild")!
  .addEventListener("click", createGuild);

document
  .querySelector("#joinGuild")!
  .addEventListener("click", joinGuild);

document
  .querySelector("#leaveGuild")!
  .addEventListener("click", leaveGuild);

document
  .querySelector("#loadGuilds")!
  .addEventListener("click", loadGuilds);

document
  .querySelector("#loadTopGuilds")!
  .addEventListener("click", loadTopGuilds);

document
  .querySelector("#loadAchievements")!
  .addEventListener("click", loadAchievements);

updateBattlePrice();

// getUniquePlayerWalletsFromEtherscan();

document
  .querySelector("#loadLeaderboard")!
  .addEventListener("click", loadLeaderboard);