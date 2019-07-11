import React, { Component } from "react";
import TodoList from "./contracts/TodoList.json";
import Web3 from "web3";

import "./App.css";

class App extends Component {
  state = {
    tasks: [],
    web3: null,
    accounts: null,
    contract: null,
    isLoading: false
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = new Web3(
        new Web3.providers.HttpProvider("http://localhost:7545")
      );

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = TodoList.networks[networkId];
      const instance = web3.eth.Contract(TodoList.abi, deployedNetwork.address);
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.getTodos);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  getTodos = async () => {
    // Get the value from the contract to prove it worked.
    const listIDs = await this.state.contract.methods.getListIDs().call();
    console.log("ids", listIDs);
    const promises = listIDs.map(
      async x => await this.state.contract.methods.tasks(x).call()
    );
    const tasks = await Promise.all(promises);
    console.log(tasks);
    // Update state with the result.
    this.setState({ tasks, isLoading: false });
  };

  createTodo = async e => {
    e.preventDefault();
    await this.state.contract.methods
      .createTask("New Todo")
      .send({ from: this.state.accounts[0] }, () => this.getTodos());
  };

  toggleComplete = async (e, id) => {
    e.preventDefault();
    await this.state.contract.methods
      .toggleCompleted(id)
      .send({ from: this.state.accounts[0] }, () => this.getTodos());
  };

  deleteTodo = async (e, id) => {
    e.preventDefault();
    await this.state.contract.methods
      .deleteTodo(id)
      .send({ from: this.state.accounts[0] }, () => this.getTodos());
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <button onClick={this.createTodo}>Create Todo</button>
        <h1>ToDapp List!</h1>
        {this.state.tasks.map(task => (
          <div key={task[0]}>
            <p>
              {task[1]} {`${task[2]}`}
            </p>
            <button onClick={e => this.toggleComplete(e, task[0])}>
              Complete
            </button>
            <button onClick={e => this.deleteTodo(e, task[0])}>
              Delete
            </button>
          </div>
        ))}
      </div>
    );
  }
}

export default App;
