// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Guestbook {
    struct Entry {
        address author;
        string message;
        uint256 timestamp;
    }

    Entry[] public entries;

    event NewEntry(address indexed author, string message, uint256 timestamp);

    function postMessage(string calldata _message) external {
        require(bytes(_message).length > 0, "Message cannot be empty");
        require(bytes(_message).length <= 280, "Message too long");

        entries.push(Entry(msg.sender, _message, block.timestamp));
        emit NewEntry(msg.sender, _message, block.timestamp);
    }

    function getEntries() external view returns (Entry[] memory) {
        return entries;
    }

    function getEntryCount() external view returns (uint256) {
        return entries.length;
    }
}
