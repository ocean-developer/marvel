import Web3 from 'web3';
import { rpcUrl } from "../constants/config";

export const getTimestamp = async () => {
    var web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
    var blockNumber =await web3.eth.getBlockNumber();
    var block = await web3.eth.getBlock(blockNumber);
    return block["timestamp"];
}