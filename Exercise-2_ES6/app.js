import TodoList from './TodoList.js';
import TodoItem from './TodoItem.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const todoList = new TodoList();
const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

async function addNewItem() {
  const title = await askQuestion("Enter the title of the new todo item: ");
  const item = new TodoItem(title);
  todoList.addItem(item);
  console.log("Added new item successfully.\n");
}

async function markItemCompleted() {
  const index = await askQuestion("Enter the index of the item you wish to mark as completed: ");
  const indexInt = parseInt(index, 10) - 1;
  if (indexInt >= 0 && indexInt < todoList.items.length) {
    todoList.completeItem(indexInt);
    console.log("Item marked as completed successfully.\n");
  } else {
    console.log("Invalid item index.\n");
  }
}

async function main() {
  let running = true;
  while (running) {
    console.log("1. Add a new todo item");
    console.log("2. Display all todo items with their status");
    console.log("3. Mark an item as completed");
    console.log("4. Exit");
    const choice = await askQuestion("Choose an action: ");

    switch (choice) {
      case '1':
        await addNewItem();
        break;
      case '2':
        todoList.displayItemsWithStatus();
        break;
      case '3':
        await markItemCompleted();
        break;
      case '4':
        running = false;
        console.log("Exiting...");
        break;
      default:
        console.log("Invalid choice, please try again.\n");
    }
  }
  rl.close();
}

main().catch(err => console.error(err));
