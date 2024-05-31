document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-item-form');
    const itemNameInput = document.getElementById('item-name');
    const itemQuantityInput = document.getElementById('item-quantity');
    const shoppingList = document.getElementById('shopping-list');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        addItem();
    });

    function loadItems() {
        const items = JSON.parse(localStorage.getItem('shoppingList')) || [];
        items.forEach(item => addItemToDOM(item.name, item.quantity, item.completed));
    }

    function saveItems() {
        const items = [];
        document.querySelectorAll('li').forEach(item => {
            items.push({
                name: item.querySelector('input[name="name"]').value,
                quantity: item.querySelector('input[name="quantity"]').value,
                completed: item.querySelector('input[type="checkbox"]').checked
            });
        });
        localStorage.setItem('shoppingList', JSON.stringify(items));
    }

    function addItem() {
        const itemName = itemNameInput.value.trim();
        const itemQuantity = itemQuantityInput.value.trim();

        if (itemName === '' || itemQuantity === '') {
            errorMessage.textContent = 'Both fields are required';
            return;
        }
        errorMessage.textContent = '';

        addItemToDOM(itemName, itemQuantity, false);

        itemNameInput.value = '';
        itemQuantityInput.value = '';
        saveItems();
    }

    function addItemToDOM(name, quantity, completed) {
        const listItem = document.createElement('li');

        const itemDetailsDiv = document.createElement('div');

        const itemCheckbox = document.createElement('input');
        itemCheckbox.type = 'checkbox';
        itemCheckbox.checked = completed;
        itemDetailsDiv.appendChild(itemCheckbox);

        const itemNameInputField = document.createElement('input');
        itemNameInputField.type = 'text';
        itemNameInputField.name = 'name';
        itemNameInputField.value = name;
        itemNameInputField.disabled = true;
        if (completed) itemNameInputField.classList.add('completed');
        itemDetailsDiv.appendChild(itemNameInputField);

        const itemQuantityInputField = document.createElement('input');
        itemQuantityInputField.type = 'number';
        itemQuantityInputField.name = 'quantity';
        itemQuantityInputField.value = quantity;
        itemQuantityInputField.disabled = true;
        itemDetailsDiv.appendChild(itemQuantityInputField);

        listItem.appendChild(itemDetailsDiv);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit');
        listItem.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        listItem.appendChild(deleteButton);

        shoppingList.appendChild(listItem);

        itemCheckbox.addEventListener('change', () => {
            itemNameInputField.classList.toggle('completed', itemCheckbox.checked);
            saveItems();
        });

        editButton.addEventListener('click', () => {
            if (editButton.textContent === 'Edit') {
                itemNameInputField.disabled = false;
                itemQuantityInputField.disabled = false;
                itemNameInputField.focus();
                editButton.textContent = 'Save';
            } else {
                itemNameInputField.disabled = true;
                itemQuantityInputField.disabled = true;
                editButton.textContent = 'Edit';
                saveItems();
            }
        });

        deleteButton.addEventListener('click', () => {
            shoppingList.removeChild(listItem);
            saveItems();
        });
    }

    loadItems();
});