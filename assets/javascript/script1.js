document.addEventListener('DOMContentLoaded', function() {
    // Get the modal
    const modal = document.getElementById("contactModal");
    const openModal = document.getElementById("openModal");
    const closeModal = document.getElementById("closeModal");

    // When the user clicks the button, open the modal
    openModal.onclick = function() {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Function to animate the progress bar
    function animateProgress(percentage) {
        const circle = document.querySelector('.circle');
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;

        // Set the stroke-dasharray
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = circumference;

        // Calculate the offset for the specified percentage
        const offset = circumference - (percentage / 100 * circumference);
        circle.style.strokeDashoffset = offset;

        // Update the percentage text
        document.getElementById('percentage').innerText = percentage + '%';
    }

    // Simulate progress completion
    setTimeout(() => {
        animateProgress(75); // Change this value to set the desired percentage
    }, 1000); // Start animation after 1 second

    // Content switching logic
    const pages = ["/html/page1.html", "/html/page2.html", "/html/page3.html", "/html/page4.html", "/html/page5.html"];
    let currentPageIndex = 0;

    // Load the initial page (page1) on page load
    fetch(pages[currentPageIndex])
        .then(response => response.text())
        .then(data => {
            document.getElementById('content').innerHTML = data;
        })
        .catch(error => console.error('Error loading page:', error));

    // Event listener for the button to change content
    document.getElementById('changeContentBtn').addEventListener('click', function(event) {
        event.preventDefault(); // To prevent page reload
        currentPageIndex = (currentPageIndex + 1) % pages.length; // Move to the next page
        fetch(pages[currentPageIndex])
            .then(response => response.text())
            .then(data => {
                document.getElementById('content').innerHTML = data;
            })
            .catch(error => console.error('Error loading page:', error));
    });
});


function showTab2(tabId) {
    const tabs = ['tab21', 'tab22', 'tab23'];
    const contents = ['tab21Content', 'tab22Content', 'tab23Content'];

    tabs.forEach((id, index) => {
        const button = document.getElementById(id);
        const content = document.getElementById(contents[index]);

        if (id === tabId) {
            button.classList.add('tab-active');
            content.classList.remove('hidden');
        } else {
            button.classList.remove('tab-active');
            content.classList.add('hidden');
        }
    });
}
// Initialize the first tab as active
showTab2('tab21');

function updateValue(value) {
document.getElementById('displayValue').innerText = value + ' m²';
}

function updateValue2(value) {
document.getElementById('displayValue2').innerText = value + ' m²';
}

function selectWunschpaket(element) {
    // Remove 'selected' class from all Wunschpaket items
    const items = document.querySelectorAll('#wunschpaket div');
    items.forEach(item => {
      item.classList.remove('selected');
    });
    // Add 'selected' class to the clicked item
    element.classList.add('selected');
  }

function selectPersonen(element) {
    // Remove 'selected' class from all Personen im Haushalt items
    const items = document.querySelectorAll('#personenHaushalt div');
    items.forEach(item => {
      item.classList.remove('selected');
    });
    // Add 'selected' class to the clicked item
    element.classList.add('selected');
  }


/****************************************
 * ****************************************
 * ****************************************/

let itemToDelete = null;

function showAddModal() {
  document.getElementById('addRoomModal').style.display = 'flex';
}

function closeAddModal() {
  document.getElementById('addRoomModal').style.display = 'none';
}

function showDeleteModal(buttonElement) {
  // العثور على العنصر الأب الأقرب الذي يحتوي على فئة 'item'
  itemToDelete = buttonElement.closest('.item');
  console.log("Item to delete:", itemToDelete); // يمكنك التحقق من العنصر هنا
  document.getElementById('deleteConfirmationModal').style.display = 'flex';
}

function closeDeleteModal() {
  document.getElementById('deleteConfirmationModal').style.display = 'none';
  itemToDelete = null;
}

function deleteItem() {
  if (itemToDelete) {
    itemToDelete.remove(); // حذف العنصر
    itemToDelete = null;
  }
  closeDeleteModal();
}

function addItem(name, icon) {
  const itemList = document.getElementById('itemList');

  // إنشاء عنصر جديد
  const newItem = document.createElement('div');
  newItem.classList.add('item');
  const itemId = `item-${Date.now()}`; // معرف فريد
  newItem.dataset.id = itemId;
  newItem.innerHTML = `
    <span class="count">0</span><i class="fa-solid fa ${icon}"></i> ${name}
    <span class="ml-2 cursor-pointer text-red-500 remove-btn" onclick="showDeleteModal(this)">
      <i class="fa-solid fa-xmark"></i>
    </span>
  `;

  // إضافة العنصر الجديد إلى القائمة
  itemList.insertBefore(newItem, itemList.querySelector('button.bg-gray-800'));

  // إغلاق النافذة المنبثقة
  closeAddModal();
}

function addCustomRoom() {
  const roomName = document.getElementById('customRoomInput').value;
  if (roomName.trim() !== '') {
    addItem(roomName, 'fa-couch'); // استخدام أيقونة افتراضية
    document.getElementById('customRoomInput').value = ''; // مسح المدخل بعد الإضافة
  } else {
    alert('Bitte geben Sie einen Raumname ein.');
  }
}

////////////////////////////////////////
//////////////////////////////////
//////////////////////////////////////

// كائن لتخزين المعلومات الخاصة بكل غرفة
const roomData = {};

function selectItem(element, roomName) {
  // إزالة الخلفية الرمادية من جميع العناصر
  const items = document.querySelectorAll('.item');
  items.forEach(item => item.style.backgroundColor = '');

  // تغيير لون الخلفية للعنصر المحدد
  element.style.backgroundColor = 'gray';

  // تحديث محتوى الحاوية بناءً على اسم الغرفة
  const itemsContainer = document.getElementById('items-container-new');
  if (roomData[roomName]) {
    itemsContainer.innerHTML = roomData[roomName];
  } else {
    itemsContainer.innerHTML = '<div class="p-4">No items available</div>';
  }

  // إضافة مستمعي الأحداث للأزرار الجديدة
  addIconEventListeners();
}

function showDeleteModal(element) {
  // إظهار نافذة تأكيد الحذف
  document.getElementById('deleteConfirmationModal').style.display = 'block';
}

function closeDeleteModal() {
  // إغلاق نافذة تأكيد الحذف
  document.getElementById('deleteConfirmationModal').style.display = 'none';
}

function showAddModal() {
  // إظهار نافذة إضافة الغرفة
  document.getElementById('addRoomModal').style.display = 'block';
}

function closeAddModal() {
  // إغلاق نافذة إضافة الغرفة
  document.getElementById('addRoomModal').style.display = 'none';
}

function addItem(roomName, iconClass) {
  // إضافة عنصر جديد إلى القائمة
  const itemList = document.getElementById('itemList');
  const newItem = document.createElement('div');
  newItem.className = 'item';
  newItem.setAttribute('data-id', roomName);
  newItem.setAttribute('onclick', `selectItem(this, '${roomName}')`);
  newItem.innerHTML = `
    <span class="count">0</span><i class="fa-solid ${iconClass}"></i> ${roomName}
    <span class="remove-btn" onclick="showDeleteModal(this)"><i class="fa-solid fa-xmark"></i></span>
  `;
  itemList.insertBefore(newItem, itemList.lastElementChild);
  closeAddModal();
}

function addCustomRoom() {
  // إضافة غرفة مخصصة
  const customRoomInput = document.getElementById('customRoomInput');
  const roomName = customRoomInput.value.trim();
  if (roomName) {
    addItem(roomName, 'fa-couch');
    customRoomInput.value = '';
  }
}

function addItemNew(itemName) {
  // إضافة عنصر جديد إلى الحاوية
  const itemsContainer = document.getElementById('items-container-new');
  const newItem = document.createElement('div');
  newItem.className = 'flex justify-between items-center p-4 bg-white rounded mb-2 shadow';
  newItem.innerHTML = `
    <div><i class="fas fa-camera"></i> ${itemName}</div>
    <div class="flex items-center">
      <button class="border px-2 decrease-btn-new" onclick="changeQuantityNew(this, -1)">-</button>
      <input type="text" value="0" class="w-10 text-center border mx-2 quantity-input-new">
      <button class="border px-2 increase-btn-new" onclick="changeQuantityNew(this, 1)">+</button>
      <button class="text-red-500 mx-2 icon-btn" onclick="changeIconColor(this)"><i class="fas fa-map-marker-alt"></i></button>
      <button class="text-gray-500 mx-2 icon-btn" onclick="changeIconColor(this)"><i class="fas fa-home"></i></button>
      <button class="text-gray-500 mx-2 icon-btn" onclick="changeIconColor(this)"><i class="fas fa-recycle"></i></button>
    </div>
  `;
  itemsContainer.appendChild(newItem);

  // حفظ المعلومات في الكائن
  const currentRoom = document.querySelector('.item[style*="background-color: gray"]').getAttribute('data-id');
  roomData[currentRoom] = itemsContainer.innerHTML;

  // إضافة مستمعي الأحداث للأزرار الجديدة
  addIconEventListeners();
}

function changeQuantityNew(button, change) {
  // تغيير الكمية
  const quantityInput = button.parentElement.querySelector('.quantity-input-new');
  let currentQuantity = parseInt(quantityInput.value);
  currentQuantity += change;
  if (currentQuantity < 0) currentQuantity = 0; // التأكد من أن الكمية لا تقل عن 0
  quantityInput.value = currentQuantity;

  // حفظ المعلومات في الكائن
  const itemsContainer = document.getElementById('items-container-new');
  const currentRoom = document.querySelector('.item[style*="background-color: gray"]').getAttribute('data-id');
  roomData[currentRoom] = itemsContainer.innerHTML;
}

function showModalNew() {
  // إظهار النافذة المنبثقة
  document.getElementById('myModalNew').classList.remove('hidden');
}

function closeModalNew() {
  // إغلاق النافذة المنبثقة
  document.getElementById('myModalNew').classList.add('hidden');
}

function changeIconColor(button) {
  // إعادة تعيين لون الخلفية لجميع الأزرار
  const iconButtons = button.parentElement.querySelectorAll('.icon-btn');
  iconButtons.forEach(btn => btn.style.backgroundColor = '');

  // تغيير لون خلفية الزر المحدد
  button.style.backgroundColor = 'red';
}

function addIconEventListeners() {
  // إضافة مستمعي الأحداث للأزرار
  const iconButtons = document.querySelectorAll('.icon-btn');
  iconButtons.forEach(button => {
    button.addEventListener('click', function() {
      changeIconColor(this);
    });
  });
}

// إضافة مستمعي الأحداث للأزرار في نافذة إضافة الغرفة
document.querySelectorAll('.flex.justify-between.items-center.px-4.py-2.border-b button').forEach(button => {
  button.addEventListener('click', function() {
    const roomName = this.parentElement.querySelector('span').innerText;
    const iconClass = 'fa-couch'; // يمكنك تغيير الأيقونة حسب الحاجة
    addItem(roomName, iconClass);
  });
});

// إضافة مستمعي الأحداث للأزرار عند تحميل الصفحة
addIconEventListeners();




















function itemNewItem(itemName) {
  // إضافة عنصر جديد إلى الحاوية
  const itemsContainer = document.getElementById('itms-cntnr');
  const newItem = document.createElement('div');
  newItem.className = 'flex justify-between items-center p-4 bg-white rounded mb-2 shadow';
  newItem.innerHTML = `
    <div>${itemName}</div>
    <div class="flex items-center">
      <button class="border px-2 decrease-btn-new" onclick="chngQnttyNw(this, -1)">-</button>
      <input type="text" value="0" class="w-10 text-center border mx-2 qntty-inpt">
      <button class="border px-2 increase-btn-new" onclick="chngQnttyNw(this, 1)">+</button>
    </div>
  `;
  itemsContainer.appendChild(newItem);

  // حفظ المعلومات في الكائن
  const currentRoom = document.querySelector('.item[style*="background-color: gray"]').getAttribute('data-id');
  roomData[currentRoom] = itemsContainer.innerHTML;
}

function chngQnttyNw(button, change) {
  // تغيير الكمية
  const quantityInput = button.parentElement.querySelector('.qntty-inpt');
  let currentQuantity = parseInt(quantityInput.value);
  currentQuantity += change;
  if (currentQuantity < 0) currentQuantity = 0; // التأكد من أن الكمية لا تقل عن 0
  quantityInput.value = currentQuantity;

  // حفظ المعلومات في الكائن
  const itemsContainer = document.getElementById('itms-cntnr');
  const currentRoom = document.querySelector('.item[style*="background-color: gray"]').getAttribute('data-id');
  roomData[currentRoom] = itemsContainer.innerHTML;
}

function shwMdlNw() {
  // إظهار النافذة المنبثقة
  document.getElementById('moda-new-my-2').classList.remove('hidden');
}

function clsMdlNw() {
  // إغلاق النافذة المنبثقة
  document.getElementById('moda-new-my-2').classList.add('hidden');
}













function toggleActive(button) {
  // Toggle the active state of the clicked button
  if (button.classList.contains('bg-red-500')) {
    button.classList.remove('bg-red-500');
    button.classList.add('bg-gray-300');
  } else {
    button.classList.remove('bg-gray-300');
    button.classList.add('bg-red-500');
  }
}


function toggleDropdown(id) {
  var content = document.getElementById(id);
  if (content.classList.contains('hidden')) {
      content.classList.remove('hidden');
  } else {
      content.classList.add('hidden');
  }
}


















function changeColorNmNu(element) {
  // إزالة فئة 'selected' من جميع العناصر
  const days = document.getElementsByClassName('day');
  for (let i = 0; i < days.length; i++) {
      days[i].classList.remove('selectedData');
  }

  // إضافة فئة 'selected' للعنصر المحدد
  element.classList.add('selectedData');
}













