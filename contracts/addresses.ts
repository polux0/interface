/**
 * See all ids below
 * https://ethereum.stackexchange.com/questions/17051/how-to-select-a-network-id-or-is-there-a-list-of-network-ids
 */
export const LOCAL_ID = 1337;
export const MAINNET_ID = 1;
export const GOERLI_ID = 5;
export const POLYGON_ID = 137;
export const POLYGON_MUMBAI = 80001;

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [GOERLI_ID]: {
    agency: "0x40B2911A8f9ff3B5a806e79DA7F9445ff3970362",
    agencyStable: "0xD7295ab92c0BAe514dC33aB9Dd142f7d10AC413b",
    agencyTreasury: "0x5c41C8AF1C022ECadf1C309F8CCA489A93077a8b",
    agencyTreasurySeed: "0xb08a51B76A5c00827336903598Dce825912bDeCc",
    agencyStableAMMRouter: "0x4d0E552aAc0370b68A23B5b00bd96f8e3FF556C5",
    tokens: {
      DAI: "0xc3dbf84Abb494ce5199D5d4D815b10EC29529ff8",
    },
  },
  [LOCAL_ID]:{
    agency: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    agencyStable: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
    agencyTreasury: "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0",
    agencyTreasurySeed: "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9"
  }
};