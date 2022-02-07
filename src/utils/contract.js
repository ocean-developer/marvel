import Web3 from 'web3';
import { MarvelABI } from '../constants/marvel';
// import { RewardManagerABI } from '../constants/rewardManager';
import { rpcUrl, contractAddress } from "../constants/config";

const getContract = (abiData, address) => {
    var web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
    const abi = abiData;
    let contract = new web3.eth.Contract(abi , address);
    return contract;
}

const splitString = (str) => {
    return str.split("#");
}

const contract = getContract(MarvelABI, contractAddress);
// const contract = getContract(RewardManagerABI, contractAddress);

export const getBalance = async (address) => {
    let balance =await contract.methods.balanceOf(address).call();
    return balance;
}

export const getTotalNodeNum = async () => {
    let totalNodeNum =await contract.methods.getTotalCreatedNodes().call();
    return totalNodeNum;
}


export const getNodesInfo = async (address) => {
    let rawResponse = await contract.methods.getNodesInfo(address).call();
    return splitString(rawResponse);
}

export const getNodeType = async (typeNum) => {
    let rawResponse = await contract.methods.getNodeType(typeNum).call();
    return rawResponse;
}

export const createNodeWithTokens = async (address, typeNum, name) => {
    try{
        let dataABI = contract.methods.createNodeWithTokens(typeNum, name).encodeABI();
        let txHash = await signTransaction(address, dataABI);
        return txHash;
    } catch(err) {
        console.log(err);
        return null;
    }
}

export const cashoutNodeReward = async (address, creationTime) => {
    try{
        let dataABI = contract.methods.cashoutReward(creationTime).encodeABI();
        let txHash = await signTransaction(address, dataABI);
        return txHash;
    } catch(err) {
        console.log(err);
        return null;
    }
}

export const cashoutAll = async (address) => {
    try{
        let dataABI = contract.methods.cashoutAll().encodeABI();
        let txHash = await signTransaction(address, dataABI);
        return txHash;
    } catch(err) {
        console.log(err);
        return null;
    }
}

export const cashoutNodeTypeReward = async (address, nodeTypeNum) => {
    try{
        let dataABI = contract.methods.cashoutNodeTypeReward(nodeTypeNum).encodeABI();
        let txHash = await signTransaction(address, dataABI);
        return txHash;
    } catch(err) {
        console.log(err);
        return null;
    }
} 

const signTransaction = async (address, dataABI) => {
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: address, // must match user's active address.
        data: dataABI,
        gasLimit: "0x5208",
        chainId: 43113,
        value: 0,
      };
    
    //sign the transaction
    try {
        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        });
        return txHash;
    } catch (error) {
        console.log(error);
    }
}