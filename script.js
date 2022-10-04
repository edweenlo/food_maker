var isDataConverted = false

function onDataParseHandler() {
  try {
    const dataInput = document.getElementById("json-data-input");
    const dataOutput = document.getElementById("data-output");

    const orders = JSON.parse(dataInput.value);

    let currentOrder = orders[0].order;

    let groupByOrderId = {};

    let index = 0;
    let nextOrder = 0;


    while (index < orders.length) {
      if (currentOrder === orders[index].order) {
        if (!groupByOrderId[nextOrder + "-" + currentOrder]) {
          groupByOrderId[nextOrder + "-" + currentOrder] = [orders[index]];
        } else {
          groupByOrderId[nextOrder + "-" + currentOrder].push(orders[index]);
        }

        index++;
      } else {
        currentOrder = orders[index].order;
        nextOrder++;
      }
    }

    let modifiedOrders = [];
    let cachedItems = {};
    
    
    Object.keys(groupByOrderId).forEach((orderId) => {
      let orders = groupByOrderId[orderId];
      
      let temp = [...orders];

      let canFulfil = true;
        
      temp.forEach((order) => {
        
        console.log(orders)
        if (
          order.available === "NULL" ||
          Number(order.quantity) > Number(order.available)
        ) {
          canFulfil = false;
          order.status = "red";
        }
      });

   
      temp.forEach((order) => {
        if (!order.status) {
          order.status = canFulfil ? "green" : "none";
        }

        modifiedOrders.push(order);
      });
      

      if (canFulfil) {
        temp.forEach((order) => {
          if (!cachedItems[order.item]) {
            cachedItems[order.item] =
              Number(order.available) - Number(order.quantity);
              
          } else {
            let availableForItem = cachedItems[order.item];

            order.available = Number(availableForItem);

            cachedItems[order.item] =
              Number(order.available) - Number(order.quantity);
          }
        });
      } else {
        temp.forEach((order) => {
          if (cachedItems[order.item]) {
            order.available = Number(cachedItems[order.item]);
          }

        });
      }



      temp.forEach((order) => {
        if (
          order.available === "NULL" ||
          Number(order.quantity) > Number(order.available)
        ) {
          canFulfil = false;
          order.status = "red";
        }
      });

   
      temp.forEach((order) => {
        if (!order.status) {
          order.status = canFulfil ? "green" : "none";
        }

        modifiedOrders.push(order);
        
      });
      

    });

    
    
    let output = "";
    

    for (let index = 0; index < modifiedOrders.length; index++) {
      const { date, order, step, item, inventorytype, quantity, available, status } =
        modifiedOrders[index];
      
      output += `
        <tr class="${status}">
          <td data-b-a-s="thin" data-fill-color="${status === 'green' ? '59CD90' : status === 'red' ? 'EE6352' : 'ffffff'}" class="date">${date}</td>
          <td data-b-a-s="thin" data-fill-color="${status === 'green' ? '59CD90' : status === 'red' ? 'EE6352' : 'ffffff'}" class="orders">${order}</td>
          <td data-b-a-s="thin" data-fill-color="${status === 'green' ? '59CD90' : status === 'red' ? 'EE6352' : 'ffffff'}" class="step">${step}</td>
          <td data-b-a-s="thin" data-fill-color="${status === 'green' ? '59CD90' : status === 'red' ? 'EE6352' : 'ffffff'}" class="item">${item}</td>
          <td data-b-a-s="thin" data-fill-color="${status === 'green' ? '59CD90' : status === 'red' ? 'EE6352' : 'ffffff'}" class="inventorytype">${inventorytype}</td>
          <td data-b-a-s="thin" data-fill-color="${status === 'green' ? '59CD90' : status === 'red' ? 'EE6352' : 'ffffff'}" class="quantity">${quantity}</td>
          <td data-b-a-s="thin" data-fill-color="${status === 'green' ? '59CD90' : status === 'red' ? 'EE6352' : 'ffffff'}" class="available">${available}</td>
        </tr>
      `;
    }

    dataOutput.innerHTML = output;

    isDataConverted = true;
  } catch (error) {
    alert("Please enter correct JSON data");
  }
}

function onExcelFileDownload() {
  if (isDataConverted) {
    const filename = prompt("Enter filename to save", "FulfillableOrders.csv")

    TableToExcel.convert(document.getElementById("visualized-data"), {
      name: filename,
    });
  } else {
    alert("Please process data, then download file");
  }
}

