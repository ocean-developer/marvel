import React from "react";

export default function NodeComponent(props) {
  return (
        <>
            {/* Header */}
            <div className="card">
                <div className="card-body">
                    <img
                        className="node-image"
                        alt="..."
                        src={require(`../${props.path}`).default}
                    />
                </div>
                <div className="card-footer">{props.title}</div>
            </div>
        </>
    );
}
