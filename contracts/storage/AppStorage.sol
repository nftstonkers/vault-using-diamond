// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

struct AppStorage {
    mapping(address => mapping(address => uint256)) balances;


}
