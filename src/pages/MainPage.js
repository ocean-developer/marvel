import React from "react";
import Header from "../components/Headers/Header";
import NodeComponent from "../components/NodeComponent";
import AnalyticBoard from "../components/AnalyticBoard";
import Input from "../components/Input";
import { nodeTypes } from "../constants/config";
import { 
    // getBalance, 
    createNodeWithTokens, 
    getNodesInfo, 
    getNodeType, 
    getTotalNodeNum,
    cashoutAll,
    cashoutNodeReward,
} from "../utils/contract";
import { getTimestamp } from "../utils/util";
import { connectState, connectedAddress } from "app/reducers/walletSlice";
import { useSelector } from 'react-redux';

export default function MainPage() {
    const [nodeType, setNodeType] = React.useState({});
    const [nodeName, setNodeName] = React.useState("");
    const [nodes, setNodes] = React.useState([]);
    const [totalNum, setTotalNum] = React.useState(0);
    const [nodesNum, setNodesNum] = React.useState(0);

    const connected = useSelector(connectState);
    const walletAddress = useSelector(connectedAddress);

    const createNode = async () => {
        // let balance = await getBalance(walletAddress);
        // console.log(balance, "ddd");
        let tx = await createNodeWithTokens(walletAddress, nodeType.typeNum, nodeName);
        console.log(tx);
    }

    const getTotalNumOfNodes = async () => {
        let totalNum = await getTotalNodeNum();
        setTotalNum(totalNum);
    }

    const loadNodeTypesInfo = async () => {
        for(let i=0; i < nodeTypes.length; i++) {
            let _nodeType = await getNodeType(nodeTypes[i].typeNum);
            nodeTypes[i].nodePrice = _nodeType.nodePrice;
            nodeTypes[i].rewardPerDay = _nodeType.rewardPerDay;
            nodeTypes[i].totalRewardReleased = _nodeType.totalRewardReleased / Math.pow(10, 18);
        }
    }

    const loadNodesInfo = async () => {
         let nodesInfoArray = [];
        try {
            nodesInfoArray = await getNodesInfo(walletAddress);
        } catch (error) {
            console.log(error);
        }
        
        let nodes = [];
        for (let i=0; i<Math.floor(nodesInfoArray.length/4); i++) {
            nodes.push({
                name: nodesInfoArray[4*i+1],
                typeNum: nodesInfoArray[4*i+2],
                creationTime: nodesInfoArray[4*i+3],
                lastClaimTime: nodesInfoArray[4*i+4]
            });
        }
        await processNodesInfo(nodes);
    }

    const processNodesInfo = async (_nodes) => {
        let nodes = [];
        let timestamp = await getTimestamp();
        for(let i=0; i < _nodes.length; i++){
            let typeNum = parseInt(_nodes[i].typeNum) - 1;
            nodes.push({
                name: _nodes[i].name,
                worrier: nodeTypes[typeNum].title,
                reward: (timestamp - _nodes[i].lastClaimTime) * (parseInt(nodeTypes[typeNum].rewardPerDay) / 86400) / Math.pow(10, 18),
                creationTime: _nodes[i].creationTime
            });
        }
        setNodes(nodes);
        setNodesNum(nodes.length);
    }
    
    const refresh = () => {
        getTotalNumOfNodes();
        loadNodeTypesInfo();
        loadNodesInfo();
    }

    const initilize = async () => {
        getTotalNumOfNodes();
        await loadNodeTypesInfo();
        loadNodesInfo();
    }

    const claimNode = async (node) => {
        let tx = await cashoutNodeReward(walletAddress, node.creationTime);
        console.log(tx);
    }

    const claimAllNodes = async () => {
        let tx = await cashoutAll(walletAddress);
        console.log(tx);
    }

    React.useEffect(() => {
        if (connected) {
            initilize();
        } else {
            setNodesNum(0);
            setNodes([]);
        }
    },  [connected]);
    
    return (
        <>
            <div className="container">
                <div color="dark">
                    <Header />
                    
                    <div>
                        <button onClick={refresh} type="button" className="btn btn-dark">
                            Refresh
                        </button>
                    </div>
                    
                    <AnalyticBoard 
                        nodesLength={nodesNum}
                        nodeTypes={nodeTypes}
                        totalNodes={totalNum}
                        nodes={nodes}
                        address={walletAddress}
                    />

                    <div className="d-flex justify-content-between" >
                        {nodeTypes.map((nodeType, i) => (
                            <div key={i} onClick={() => setNodeType(nodeType)}>
                                <NodeComponent 
                                    key={i}
                                    title={nodeType.title} 
                                    path={nodeType.imgPath} 
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-4">
                        <Input
                            placeholder={"Name your Node"}
                            onChange={e => setNodeName(e.target.value)}
                        />
                        <div className="mt-3">
                            <button type="button" className="btn btn-secondary" onClick={createNode}>Create Node</button>
                        </div>
                    </div>

                    <button onClick={() => claimAllNodes()} type="button" className="mt-4 btn btn-dark">
                        Claim All
                    </button>

                    <table className="mt-4 table table-dark table-hover">
                        <thead>
                        <tr>
                            <th>My Nodes</th>
                            <th>Worrior</th>
                            <th>RPC</th>
                            <th>Rewards</th>
                            <td>Cash Out</td>
                        </tr>
                        </thead>
                        <tbody>
                            {nodes.map((node, i) => (
                                <tr key={i}>
                                    <td>{node.name}</td>
                                    <td>{node.worrier}</td>
                                    <td>-</td>
                                    <td>{node.reward.toFixed(2)}</td>
                                    <td>            
                                        <button onClick={() => claimNode(node)} type="button" className="btn btn-dark">
                                            Claim
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
