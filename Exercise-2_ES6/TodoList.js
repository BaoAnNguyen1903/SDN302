class TodoList {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    this.items.push(item);
  }

  getItemTitles() {
    return this.items.map(item => item.title);
  }

  displayItemsWithStatus() {
    this.items.forEach((item, index) => {
      console.log(`${index + 1}. [${item.completed ? 'X' : ' '}] ${item.title}`);
    });
  }

  completeItem(index) {
    if (index >= 0 && index < this.items.length) {
      this.items[index].complete();
    }
  }
}

export default TodoList;
