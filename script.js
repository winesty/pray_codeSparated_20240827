const characters = ["지", "기", "금", "지", "원", "위", "대", "강", "시", "천", "주", "조", "화", "정", "영", "세", "불", "망", "만", "사", "지"];
let currentBead = 0;
let selectedItem = null;
let count = 0;
let beadCount = 21;
let beepCount = 0;

const touchArea = document.getElementById('touchArea');
const countDisplay = document.getElementById('touchCountDisplay');
const inputButton = document.getElementById('inputButton');
const userInput = document.getElementById('userInput');
const inputList = document.getElementById('inputList');
const dropdownMenu = document.getElementById('dropdownMenu');
const menuButton = document.getElementById('menuButton');
const currentBeadsDisplay = document.getElementById('currentBeads');
const beadCountSelector = document.getElementById('beadCountSelector');
const beadCountOptions = document.getElementById('beadCountOptions');
const customBeadCount = document.getElementById('customBeadCount');
const beepSelector = document.getElementById('beepSelector');
const beepOptions = document.getElementById('beepOptions');
const currentBeepDisplay = document.getElementById('currentBeep');
const currentBeepBeadsDisplay = document.getElementById('currentBeepBeads');
const customBeepCount = document.getElementById('customBeepCount');

menuButton.addEventListener('click', function () {
    dropdownMenu.classList.toggle('hidden');
    beadCountOptions.classList.add('hidden');
});

beadCountSelector.addEventListener('click', function (e) {
    e.stopPropagation();
    beadCountOptions.classList.toggle('hidden');
});

beepSelector.addEventListener('click', function (e) {
    e.stopPropagation();
    beepOptions.classList.toggle('hidden');
    beadCountOptions.classList.add('hidden');
});

document.addEventListener('click', function (e) {
    if (!menuButton.contains(e.target) && !dropdownMenu.contains(e.target) && !beadCountOptions.contains(e.target)) {
        dropdownMenu.classList.add('hidden');
        beadCountOptions.classList.add('hidden');
        beepOptions.classList.add('hidden');  
    }
});

beadCountOptions.addEventListener('click', function (e) {
    if (e.target.classList.contains('bead-option')) {
        const newCount = e.target.dataset.count;
        if (newCount) {
            beadCount = parseInt(newCount);
            updateBeadCount();
        } else if (e.target.id === 'customBeadCount') {
            const userInput = prompt('원하는 묵주 알 갯수를 입력하세요:');
            if (userInput === null || userInput.trim() === '') {
                alert('숫자를 넣어주세요');
            } else {
                const parsedInput = parseInt(userInput);
                if (!isNaN(parsedInput) && parsedInput > 0) {
                    beadCount = parsedInput;
                    updateBeadCount();
                } else {
                    alert('유효한 숫자를 입력해주세요');
                }
            }
        }
        beadCountOptions.classList.add('hidden');
    }
});

function updateBeadCount() {
    currentBeadsDisplay.textContent = beadCount;
    currentBeepBeadsDisplay.textContent = beadCount;
    localStorage.setItem('beadCount', beadCount); // Save to localStorage
    if (beepCount === beadCount) {
        currentBeepDisplay.textContent = `현재 ${beadCount}`;
    }
    recreateBeads();
}

function recreateBeads() {
    touchArea.innerHTML = `<div id="touchCountDisplay">묵송 회수: ${count}</div>`;
    createBeads();
    resetBeadOrder();
}

function updateListCount() {
    document.getElementById('listCount').textContent = `목록 수: ${inputList.children.length}`;
}

function addInputToList() {
    const input = userInput.value.trim();
    if (input) {
        const item = document.createElement('div');
        item.className = 'inputItem';
        item.innerHTML = `
            <span class="itemText">${input} : 0</span>
            <button class="deleteButton">삭제</button>
            <button class="resetButton">리셋</button>`;
        item.dataset.count = 0;
        item.addEventListener('click', selectItem);
        item.addEventListener('contextmenu', showButtons);
        item.querySelector('.deleteButton').addEventListener('click', deleteItem);
        item.querySelector('.resetButton').addEventListener('click', resetItemCount);
        inputList.insertBefore(item, inputList.firstChild);
        userInput.value = '';
        updateListCount();
        selectItem({ target: item });
        saveListToLocalStorage(); // Save the list in localStorage
    }
}

function saveListToLocalStorage() {
    const items = [];
    document.querySelectorAll('.inputItem').forEach(item => {
        const text = item.querySelector('.itemText').textContent.split(' : ')[0];
        const count = item.dataset.count;// Get the count from the dataset
        items.push({ text, count });// Save the text and count in the array
    });
    localStorage.setItem('userItems', JSON.stringify(items));// Store the array in localStorage
}

function deleteItem(e) {
    e.stopPropagation();
    const itemToDelete = e.target.closest('.inputItem');
    inputList.removeChild(itemToDelete);
    updateListCount();
    if (selectedItem === itemToDelete) {
        selectedItem = null;
    }
}

function resetItemCount(e) {
    e.stopPropagation();
    const itemToReset = e.target.closest('.inputItem');
    itemToReset.dataset.count = 0;
    itemToReset.querySelector('.itemText').textContent = `${itemToReset.querySelector('.itemText').textContent.split(':')[0]} : 0`;
}

function selectItem(e) {
    if (selectedItem) {
        selectedItem.style.backgroundColor = '';
    }
    selectedItem = e.currentTarget || e.target;
    selectedItem.style.backgroundColor = 'lightblue';
    count = parseInt(selectedItem.dataset.count);

    // console.log("Selected item count:", count); // Log the selected item's count
    
    countDisplay.textContent = `묵송 회수: ${count}`;
    resetBeadOrder();
}

function showButtons(e) {
    e.preventDefault();
    const item = e.target.closest('.inputItem');
    const deleteButton = item.querySelector('.deleteButton');
    const resetButton = item.querySelector('.resetButton');
    deleteButton.style.display = 'block';
    resetButton.style.display = 'block';

    document.addEventListener('click', function hideButtons(event) {
        if (!item.contains(event.target) && !deleteButton.contains(event.target) && !resetButton.contains(event.target)) {
            deleteButton.style.display = 'none';
            resetButton.style.display = 'none';
            document.removeEventListener('click', hideButtons);
        }
    });
}

function createBeads() {
    const radius = 120;
    const centerX = 150;
    const centerY = 150;
    for (let i = 0; i < beadCount; i++) {
        const bead = document.createElement('div');
        bead.className = 'bead';
        bead.textContent = characters[i % characters.length];
        if (i === 0) {
            bead.classList.add('first-bead');
            bead.style.left = `${centerX - 17}px`;
            bead.style.top = `${centerY - radius - 17}px`;
        } else {
            const angle = (i / beadCount) * (2 * Math.PI) - Math.PI / 2;
            const x = centerX + radius * Math.cos(angle) - 14;
            const y = centerY + radius * Math.sin(angle) - 14;
            bead.style.left = `${x}px`;
            bead.style.top = `${y}px`;
        }
        touchArea.appendChild(bead);
    }
}

function playBeep() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // 440 Hz is A4
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1); // Beep for 100ms
}

function lightUpBead() {
    const beads = document.querySelectorAll('.bead');
    beads.forEach(bead => bead.classList.remove('highlight'));
    if (beads.length > 0) {
        beads[currentBead].classList.add('highlight');
        currentBead = (currentBead + 1) % beads.length;
    }

    count++;
    countDisplay.textContent = `묵송 회수: ${count}`;
    if (selectedItem) {
        selectedItem.dataset.count = count;
        selectedItem.querySelector('.itemText').textContent = `${selectedItem.querySelector('.itemText').textContent.split(':')[0]} : ${count}`;
    }

    // console.log("Updated selected item count:", count); // Log the updated count

    saveListToLocalStorage(); // Save the updated list with counts to localStorage

    
    if (beepCount > 0 && count % beepCount === 0) {
        playBeep();
    }
}

function resetBeadOrder() {
    const beads = document.querySelectorAll('.bead');
    beads.forEach(bead => bead.classList.remove('highlight'));
    currentBead = 0;
}

touchArea.addEventListener('mousedown', lightUpBead);
inputButton.addEventListener('click', addInputToList);
beepOptions.addEventListener('click', function (e) {
    if (e.target.classList.contains('beep-option')) {
        const newBeep = e.target.dataset.beep;
        if (newBeep === 'off') {
            beepCount = 0;
            currentBeepDisplay.textContent = '소리 없음';
        } else if (newBeep === 'current') {
            beepCount = beadCount;
            currentBeepDisplay.textContent = `현재 ${beadCount}`;
            currentBeepBeadsDisplay.textContent = beadCount;
        } else if (e.target.id === 'customBeepCount') {
            const userInput = prompt('몇 번째마다 소리를 낼지 입력하세요:');
            if (userInput === null || userInput.trim() === '') {
                alert('숫자를 넣어주세요');
            } else {
                const parsedInput = parseInt(userInput);
                if (!isNaN(parsedInput) && parsedInput > 0) {
                    beepCount = parsedInput;
                    currentBeepDisplay.textContent = `${beepCount}`;
                } else {
                    alert('유효한 숫자를 입력해주세요');
                }
            }
        }
        localStorage.setItem('beepCount', beepCount); // Save to localStorage
        beepOptions.classList.add('hidden');
    }
});

// Utility function to save and load data from localStorage

function saveListToLocalStorage() {
    const items = [];
    document.querySelectorAll('.inputItem').forEach(item => {
        const text = item.querySelector('.itemText').textContent.split(' : ')[0];
        const count = item.dataset.count;
        items.push({ text, count });
    });

    // console.log("Saving items to localStorage:", items); // Log the items being saved
    
    localStorage.setItem('userItems', JSON.stringify(items));
}

function loadListFromLocalStorage() {
    const savedItems = JSON.parse(localStorage.getItem('userItems')) || [];

    // console.log("Loaded items from localStorage:", savedItems); // Log the loaded items
    
    savedItems.forEach(itemData => {
        const item = document.createElement('div');
        item.className = 'inputItem';
        item.innerHTML = `
            <span class="itemText">${itemData.text} : ${itemData.count}</span>
            <button class="deleteButton">삭제</button>
            <button class="resetButton">리셋</button>`;
        item.dataset.count = itemData.count; // Set the count in the dataset
        item.addEventListener('click', selectItem);
        item.addEventListener('contextmenu', showButtons);
        item.querySelector('.deleteButton').addEventListener('click', deleteItem);
        item.querySelector('.resetButton').addEventListener('click', resetItemCount);
        inputList.insertBefore(item, inputList.firstChild);
    });
    updateListCount();
}

// Place the `loadBeadCountFromLocalStorage` function here
function loadBeadCountFromLocalStorage() {
    const savedBeadCount = localStorage.getItem('beadCount');
    if (savedBeadCount !== null) {
        beadCount = parseInt(savedBeadCount);
        updateBeadCount();
    }
}

function loadBeepCountFromLocalStorage() {
    const savedBeepCount = localStorage.getItem('beepCount');
    if (savedBeepCount !== null) {
        beepCount = parseInt(savedBeepCount, 10);
        currentBeepDisplay.textContent = beepCount === 0 ? '소리 없음' : `${beepCount}`;
    }
}

createBeads();
loadListFromLocalStorage();
loadBeadCountFromLocalStorage();
loadBeepCountFromLocalStorage();
