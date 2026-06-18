export const NETWORKS = {
  ethereumSepolia: {
    name: "Ethereum Sepolia",
    chainId: "0xaa36a7",
    chainIdDecimal: 11155111,
    contractAddress: "0xce7db8f0442fa80c0fab9799e069a94fa477089d",
    rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
    explorer: "https://sepolia.etherscan.io",
  },
  arbitrumSepolia: {
    name: "Arbitrum Sepolia",
    chainId: "0x66eee",
    chainIdDecimal: 421614,
    contractAddress: "0xaf6e5c828cca5cabca85733bc45e318c8bc83141",
    rpcUrl: "https://arbitrum-sepolia-rpc.publicnode.com",
    explorer: "https://sepolia.arbiscan.io",
  },
  arbitrumOne: {
    name: "Arbitrum One",
    chainId: "0xa4b1",
    chainIdDecimal: 42161,
    contractAddress: "0x39a85C7d3dB291DA733B9d085B3DE8F4F425Eb5c",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    explorer: "https://arbiscan.io",
  },
} as const;


export const REGISTER_PRICE = "0.0001";
export const COMMON_PRICE = "0.001";
export const CREATE_GUILD_PRICE = "0.01";

export const NFT_METADATA_BASE = "https://gateway.pinata.cloud/ipfs/bafybeihebr72fet5ccpp5qrxwhxo3jimxb4hshffk6b6w3kej35oe4xtbu/";

export const CONTRACT_ABI = [
  // Player actions
  "function registerPlayer(string _name, uint8 _classId) payable",
  "function battle(uint8 _enemyId, uint256 _battleRounds) payable",
  "function challengePlayer(address _targetPlayer, uint256 _battleRounds) payable",
  "function heal(address _player) payable",
  "function revive(address _player) payable",

  // Guild actions
  "function createGuild(string _name) payable",
  "function joinGuild(uint256 _guildId)",
  "function leaveGuild()",
  "function addGuildMember(uint256 _guildId, address _player)",
  "function removeGuildMember(uint256 _guildId, address _player)",
  "function getGuilds(uint256 _offset, uint256 _limit) view returns (tuple(uint256 id, string name, address guildOwner, uint256 membersCount, uint256 points, bool exists)[])",
  "function getTopGuilds() view returns (tuple(uint256 id, string name, address guildOwner, uint256 membersCount, uint256 points, bool exists)[5])",

  // Achievement actions
  "function claimAchievement(uint256 _achievementId)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function balanceOf(address owner) view returns (uint256)",

  // Players / enemies / classes
  "function players(address) view returns (uint256 lv, string name, uint256 exp, uint256 nextLv, uint8 classId, string class, uint256 maxHp, uint256 currentHp, uint256 atk, uint256 def, uint256 magic, bool isAlive)",
  "function enemies(uint8) view returns (uint8 id, string name, uint256 hp, uint256 atk, uint256 def, uint256 magic, bool isAlive, uint256 exp, uint256 gold)",
  "function classes(uint8) view returns (string)",

  // Prices / constants
  "function REGISTER_PRICE() view returns (uint256)",
  "function COMMON_PRICE() view returns (uint256)",
  "function CREATE_GUILD_PRICE() view returns (uint256)",
  "function PLAYER_SLAYER() view returns (uint256)",
  "function PLAYER_SLAYER_REQUIRED_KILLS() view returns (uint256)",
  "function MAX_PVP_LEVEL_DIFFERENCE() view returns (uint256)",
  "function MAX_GUILD_POINTS_PER_KILL() view returns (uint256)",

  // Guild state
  "function guilds(uint256) view returns (uint256 id, string name, address guildOwner, uint256 membersCount, uint256 points, bool exists)",
  "function playerGuild(address) view returns (uint256)",
  "function guildIdByNameHash(bytes32) view returns (uint256)",
  "function topGuilds(uint256) view returns (uint256)",
  "function nextGuildId() view returns (uint256)",

  // Achievement state
  "function monsterSlayeds(address, uint8) view returns (uint256)",
  "function playerSlayeds(address) view returns (uint256)",
  "function hasDefeatedPlayer(address, address) view returns (bool)",
  "function uniquePlayersSlayed(address) view returns (uint256)",
  "function hasAchievement(address, uint256) view returns (bool)",
  "function tokenAchievement(uint256) view returns (uint256)",
  "function achievementRequirement(uint8) view returns (uint256)",
  "function nextTokenId() view returns (uint256)",

  // Combat helpers
  "function calcDamageForPlayer(address _player, uint8 _enemyId) view returns (uint256)",
  "function calcDamageForEnemy(uint8 _enemyId, address _targetPlayer) view returns (uint256)",
  "function calcDamageForPlayerVsPlayer(address _player, address _targetPlayer) view returns (uint256)",
  "function randomNumber() view returns (uint256)",
  "function getLvUpBonus(uint8 _class) pure returns (uint8[4])",

  // Events
  "event battleLog(uint256 round, string message, uint256 value)",
  "event GuildCreated(uint256 indexed guildId, string name, address indexed leader)",
  "event GuildJoined(uint256 indexed guildId, address indexed player)",
  "event GuildLeft(uint256 indexed guildId, address indexed player)",
  "event GuildPointsChanged(uint256 indexed winnerGuildId, uint256 indexed loserGuildId, uint256 winnerPoints, uint256 loserPoints)",
  "event MonsterSlayed(address indexed player, uint8 indexed enemyId, uint256 totalSlayed)",
  "event PlayerSlayed(address indexed winner, address indexed loser, uint256 totalSlayed)",
  "event AchievementClaimed(address indexed player, uint256 indexed achievementId, uint256 indexed tokenId)",
];