import React from "react";
import ConnectButton from "./ConnectButton";

export default function Header() {
  return (
        <>
            {/* Header */}
            <div className="row">
                <div className="col-6">
                    <h1>Thor Financial</h1>
                </div>
                <div className="col-6">
                    <div className="float-right">
                        <ConnectButton/>
                    </div>
                </div>
            </div>
        </>
    );
}
