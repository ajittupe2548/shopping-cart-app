function updateFilteredListInefficiently(data, filterText) {
    const listContainer = document.getElementById('myList');
    listContainer.innerHTML = ''; // Clear previous content

    const fragment = document.createDocumentFragment();

    data.forEach(item => {
        if (item.name.includes(filterText)) {
            const listItem = document.createElement('div');
            listItem.textContent = item.name;
            listItem.className = 'list-item';
            fragment.appendChild(listItem);
        }
    });

    listContainer.appendChild(fragment);
}