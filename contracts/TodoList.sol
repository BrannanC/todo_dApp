pragma solidity ^0.5.0;

contract TodoList {
    uint public taskCount = 0;

    struct Task {
        uint id;
        string content;
        bool completed;
        bool deleted;
    }

    mapping(uint => Task) public tasks;
    event TaskCreated (
      uint id,
      string content,
      bool completed,
      bool deleted
    );

    function createTask(string memory _content) public {
        tasks[taskCount] = Task(taskCount, _content, false, false);
        emit TaskCreated(taskCount, _content, false, false);
        taskCount++;
    }

    function getListIDs() public view returns (uint[] memory) {
      uint[] memory taskIDs = new uint[](taskCount);
      uint numberTasks = 0;

      for(uint i = 1; i <= taskCount; i++){
        if(tasks[i].deleted == false){
          taskIDs[numberTasks] = tasks[i].id;
          numberTasks++;
        }
      }
      return taskIDs;
    }

    function toggleCompleted(uint _id) public {
      tasks[_id].completed = !tasks[_id].completed;
    }

    constructor() public {
        createTask("Build todo dapp");
    }
}