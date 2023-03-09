/**
 * See all ids below
 * https://ethereum.stackexchange.com/questions/17051/how-to-select-a-network-id-or-is-there-a-list-of-network-ids
 */
export const LOCAL_ID = 1337;
export const MAINNET_ID = 1;
export const RINKEBY_ID = 4;
export const GOERLI_ID= 5;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [MAINNET_ID]: {
    exchanges: {
      "ETH-DAI": "0x2a1530C4C41db0B0b2bB646CB5Eb1A67b7158667",
      "ETH-MKR": "0x2C4Bd064b998838076fa341A83d007FC2FA50957",
      "ETH-sETH": "0xe9Cf7887b93150D4F2Da7dFc6D502B216438F244",
      "ETH-USDC": "0x97deC872013f6B5fB443861090ad931542878126",
    },
    factory: "0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95",
    tokens: {
      BAT: "0x0D8775F648430679A709E98d2b0Cb6250d2887EF",
      DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      KNC: "0xdd974D5C2e2928deA5F71b9825b8b646686BD200",
      LINK: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
      MKR: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
      REP: "0x1985365e9f78359a9B6AD760e32412f4a445E862",
      SNX: "0xC011A72400E58ecD99Ee497CF89E3775d4bd732F",
      sETH: "0x5e74C9036fb86BD7eCdcb084a0673EFc32eA31cb",
      sUSD: "0x57Ab1E02fEE23774580C119740129eAC7081e9D3",
      USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      wBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      ZRX: "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
    },
  },
  [RINKEBY_ID]: {
    factory: "0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36",
    tokens: {
      DAI: "0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8",
    },
  },
  [GOERLI_ID]: {
    agency: "0x34fdd37C503De73c6D521161C43873d79177F86f",
    agencyStable: "0x531734989A71f78054450BbfEB3C70BA3BffEf2c",
    agencyStableAMMRouter: "0x4d0E552aAc0370b68A23B5b00bd96f8e3FF556C5",
    tokens: {
      DAI: "0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8",
    },
  [LOCAL_ID]:{
    agency: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    agencyStable: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
    agencyTreasury: "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0",
    agencyTreasurySeed: "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9"
  }
  },
};
