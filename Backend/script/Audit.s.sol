// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/Audit.sol";

contract AuditScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        Audit audit = new Audit(0xe01754DEB54c4915D65331Fa31ebf9111CacF9C2);

        vm.stopBroadcast();
    }
}
