import React from "react";
import { cashoutNodeTypeReward } from "../utils/contract";

export default function AnalyticBoard(props) {

    const claimNodeType = async (address, nodeType) => {
        let tx = await cashoutNodeTypeReward(address, nodeType.typeNum);
        console.log(tx);
    }

    const calNodeTypeReward = (nodeType) => {
        let reward = 0;
        props.nodes.forEach((node) => {
            if (node.worrier === nodeType.title)
                reward += node.reward;
        });
        return reward.toFixed(2);
    }

    return (
        <>
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        
                        <div className="col-6">
                            <div>My Nodes: {props.nodesLength}/100</div>
                            <div>Total Nodes: {props.totalNodes}</div>
                            <div>
                                {props.nodeTypes.map((nodeType, i) => (
                                    <div key={i}>
                                        {nodeType.title} : {nodeType.totalRewardReleased}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-6">
                            <h2>Rewards</h2>
                            <div>
                                {props.nodeTypes.map((nodeType, i) => (
                                    <div key={i}>
                                        {nodeType.title} : {calNodeTypeReward(nodeType)}---
                                        <button onClick={() => claimNodeType(props.address, nodeType)} type="button" className="btn btn-sm btn-dark">Claim</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
