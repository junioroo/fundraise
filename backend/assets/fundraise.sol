// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Fundraise {
    struct Project {
        string name;
        string url;
        uint256 maxCapPerInvestor;
        mapping(address => Investor) investors;
    }

    struct Investor {
        uint256 totalInvestment;
    }

    mapping(uint256 => Project) public projects;
    uint256 public totalProjects;

    constructor() {
        totalProjects = 0;
    }

    function createProject(string memory _name, string memory _url, uint256 _maxCapPerInvestor) external {
        require(bytes(_name).length > 0, "Invalid project name");
        require(bytes(_url).length > 0, "Invalid project URL");
        require(_maxCapPerInvestor > 0, "Invalid maximum cap");

        uint256 projectId = totalProjects;

        projects[projectId].name = _name;
        projects[projectId].url = _url;
        projects[projectId].maxCapPerInvestor = _maxCapPerInvestor;

        totalProjects++;
    }

    function setFundraisingLimit(uint256 projectId, address investor, uint256 limit) external {
        require(projectId < totalProjects, "Invalid project ID");

        projects[projectId].maxCapPerInvestor = limit;
    }

    function invest(uint256 projectId) external payable {
        require(projectId < totalProjects, "Invalid project ID");

        Project storage project = projects[projectId];
        Investor storage investor = project.investors[msg.sender];

        uint256 limit = projects[projectId].maxCapPerInvestor;
        uint256 remainingInvestment = limit - investor.totalInvestment;
        require(remainingInvestment > 0, "Investment limit reached");

        uint256 investmentAmount = msg.value;
        require(investmentAmount <= remainingInvestment, "Investment exceeds limit");

        investor.totalInvestment += investmentAmount;
    }

    function listProjects() external view returns (string[] memory, string[] memory, uint256[] memory) {
        string[] memory projectNames = new string[](totalProjects);
        string[] memory projectUrls = new string[](totalProjects);
        uint256[] memory maxCaps = new uint256[](totalProjects);

        for (uint256 i = 0; i < totalProjects; i++) {
            projectNames[i] = projects[i].name;
            projectUrls[i] = projects[i].url;
            maxCaps[i] = projects[i].maxCapPerInvestor;
        }

        return (projectNames, projectUrls, maxCaps);
    }


    function getTotalInvestment(uint256 projectId, address investor) external view returns (uint256) {
        require(projectId < totalProjects, "Invalid project ID");

        return projects[projectId].investors[investor].totalInvestment;
    }

    function getRemainingInvestment(uint256 projectId, address investor) external view returns (uint256) {
        require(projectId < totalProjects, "Invalid project ID");

        return projects[projectId].maxCapPerInvestor - projects[projectId].investors[investor].totalInvestment;
    }
}
