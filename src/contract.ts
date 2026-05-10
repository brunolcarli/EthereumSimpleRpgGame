export const CONTRACT_ADDRESS = "0xeCb298f067823ad31414718f63aaFe436943232C";

export const SEPOLIA_CHAIN_ID = "0xaa36a7";

export const REGISTER_PRICE = "0.0001";
export const PRICE_PER_ROUND = "0.001";
export const REVIVE_PRICE = "0.001";

export const CONTRACT_ABI = [
  "function registerPlayer(string _name, uint8 _classId) payable",
  "function battle(uint8 _enemyId, uint256 _battleRounds) payable",
  "function revive(address _player) payable",

  "function players(address) view returns (uint256 lv, string name, uint256 exp, uint256 nextLv, uint8 classId, string class, uint256 maxHp, uint256 currentHp, uint256 atk, uint256 def, uint256 magic, bool isAlive)",
  "function enemies(uint8) view returns (uint8 id, string name, uint256 hp, uint256 atk, uint256 def, uint256 magic, bool isAlive, uint256 exp)",
  "function classes(uint8) view returns (string)",

  "function registerPrice() view returns (uint256)",
  "function pricePerRound() view returns (uint256)",
  "function revivePrice() view returns (uint256)",

  "event battleLog(uint8 round, string message, uint256 value)"
];