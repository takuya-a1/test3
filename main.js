// main.js
var exerciseCounts = {};

Papa.parse("data.csv", {
  header: true,
  download: true,
  dynamicTyping: true,
  complete: function (results) {
    var exerciseListElement = document.getElementById('exerciseList');
    var addedProducts = [];

    results.data.forEach(function (item) {
      if (item.display === 1 && !addedProducts.includes(item.name)) {
        var exerciseElement = document.createElement('div');
        exerciseElement.classList.add('exercise');
        exerciseElement.dataset.name = item.name;
        exerciseElement.dataset.time = item.time;

        exerciseElement.innerHTML = `
          <img src="${item.image}" alt="${item.name}">
          <h3>${item.name}</h3>
          <p>${item.detail}</p>
          <p>時間: ${item.time} 分</p>
          <button class="addToCartButton" onclick="addToCart('${item.name}', ${item.time}, '${item.image}')">カートに追加</button>
        `;

        exerciseListElement.appendChild(exerciseElement);
        addedProducts.push(item.name);
      }
    });

    // カート項目を並び替え可能にする
    new Sortable(document.getElementById('cartItems'), {
      animation: 150,
      ghostClass: 'ghost',
      onUpdate: updateExerciseOrder,
    });

    // 復元処理
    restoreCart();

    // "合計を見る"ボタンのクリックイベントを追加
    document.getElementById('viewTotalCountButton').addEventListener('click', function () {
      // モーダルを表示する処理を追加
      openModal();
    });

    // モーダルのクローズボタンとモーダル自体のクリックイベントを追加
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('modal').addEventListener('click', function (event) {
      if (event.target === this) {
        closeModal();
      }
    });

    // ... 以下は変更なし ...
  }
});

// 以下の行を追加
function updateExerciseOrder() {
  // ここに並び替えの処理を実装
}

function saveCartItem(cartItem) {
  // ここにカートアイテムの保存処理を実装
}

// カートにアイテムを追加する関数
function addToCart(name, time, imagePath) {
  // 重複追加を防ぐ
  if (!isItemInCart(name)) {
    // カートアイテムを保存
    saveCartItem({
      name: name,
      time: time,
      imagePath: imagePath
    });

    // カートアイテムを表示
    var cartItemsElement = document.getElementById('cartItems');
    var liElement = document.createElement('li');
    liElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

    var imgElement = document.createElement('img');
    imgElement.src = imagePath;
    imgElement.alt = name;
    imgElement.style.width = '50px'; // 画像サイズを調整

    var spanElement = document.createElement('span');
    spanElement.textContent = `${name} - ${time} 分`;

    var buttonElement = document.createElement('button');
    buttonElement.classList.add('btn', 'btn-danger', 'btn-sm');
    buttonElement.textContent = '削除';
    buttonElement.onclick = function () {
      removeFromCart(name);
    };

    liElement.appendChild(imgElement);
    liElement.appendChild(spanElement);
    liElement.appendChild(buttonElement);

    cartItemsElement.appendChild(liElement);

    // 合計時間を更新
    updateTotalTime();
  } else {
    console.log(`${name} は既にカートに追加されています。`);
  }
}

// カートからアイテムを削除する関数
function removeFromCart(name) {
  var savedCart = localStorage.getItem('exerciseCart');
  var cartArray = savedCart ? JSON.parse(savedCart) : [];

  // カートから対象のアイテムを削除
  cartArray = cartArray.filter(function (cartItem) {
    return cartItem.name !== name;
  });

  // カートを保存
  localStorage.setItem('exerciseCart', JSON.stringify(cartArray));

  // カートを再表示
  restoreCart();

  // 合計時間を更新
  updateTotalTime();
}

// カートにアイテムがあるか確認する関数
function isItemInCart(name) {
  var savedCart = localStorage.getItem('exerciseCart');
  var cartArray = savedCart ? JSON.parse(savedCart) : [];

  return cartArray.some(function (cartItem) {
    return cartItem.name === name;
  });
}

// 合計時間を更新する関数
function updateTotalTime() {
  var savedCart = localStorage.getItem('exerciseCart');
  var cartArray = savedCart ? JSON.parse(savedCart) : [];
  var totalTime = 0;

  cartArray.forEach(function (cartItem) {
    totalTime += cartItem.time;
  });

  // 合計時間を表示
  document.getElementById('totalCount').textContent = totalTime;
}
