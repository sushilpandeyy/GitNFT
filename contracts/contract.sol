// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ContribNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Mapping to track user scores and their milestone achievements
    mapping(address => uint256) public userScores;
    mapping(address => mapping(uint256 => bool)) public milestonesReached;

    // Events
    event NFTMinted(address recipient, uint256 tokenId, string tokenURI);
    event ScoreUpdated(address user, uint256 newScore);

    // Constructor
    constructor() ERC721("ContribNFT", "CNTB") Ownable(msg.sender) {}

    // Function to update user scores based on contributions
    function updateUserScore(address user, uint256 score) public onlyOwner {
        userScores[user] += score;
        emit ScoreUpdated(user, userScores[user]);
    }

    // Function to mint NFT if the user reaches a specific milestone
    function mintNFT(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        require(userScores[recipient] >= 1000, "Insufficient score for minting NFT");

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        emit NFTMinted(recipient, newItemId, tokenURI);

        return newItemId;
    }

    // Function to check if a user has reached a specific milestone
    function hasReachedMilestone(address user, uint256 milestone) public view returns (bool) {
        return milestonesReached[user][milestone];
    }

    // Function to set a milestone as reached for a user
    function setMilestoneReached(address user, uint256 milestone) public onlyOwner {
        milestonesReached[user][milestone] = true;
    }
}