var app = new function() {

  this.el = document.getElementById('coffees');
  this.url = 'http://localhost:5000/coffee';
  
  this.coffees = [];
  this.filteredByProducer = [];
  this.sortedByPrice = [];
  
  this.sortTriggered = false;
  this.searchTriggered = false;
  


  
    //                                          //
    //                 COUNTERS                 //
    //                                          //
  
  
    // COUNT ALL ITEMS
  
  this.Count = function(data) {
    var el   = document.getElementById('counter');
    var name = 'coffees';
  
    if (data) {
      if (data == 1) {
      name = 'coffee';
      }
      el.innerHTML = data + ' ' + name;
  
      document.getElementById('clear-spoiler').style.display = 'block';
      document.getElementById('search-by-producer').style.display = 'block';
    } else {
      el.innerHTML = 'No ' + name;

      document.getElementById('clear-spoiler').style.display = 'none';
    }
  };

    
  this.CountPrice = function(array) {
    var el   = document.getElementById('total-price-counter');
    var totalPrice = 0;
    if (array.length > 0) {
      for (i = 0; i < array.length; i++) {
        totalPrice += Number(array[i].price);
      }
    }
    el.innerHTML = 'Total price: ' + totalPrice;
  };
    //////////////////////////////////////////////
  
    // COUNT TOTAL AMOUNT OF ITEMS PRODUCED BY BRASIL

    this.CountBrasilianProducts = function(array) {
      var el = document.getElementById('brasilian-products-counter');
      var counter = 0;
      if (array.length > 0) {
        for (i = 0; i < array.length; i++) {
          if (array[i].producer === 'Brasil') {
            counter++;
          }
        }
      }
      el.innerHTML = 'Total amount of Brasilian products: ' + counter;
    };
  
    //////////////////////////////////////////////
    //////////////////////////////////////////////
  
    //                                          //
    //                   CRUD                   //
    //                                          //
  
  
    // READ ALL ITEMS
  
  this.FetchAll = async function() {
   var data = '';
   var array = [];
    if (this.searchTriggered) {     

      if (window.localStorage.getItem("FILTERED")) {
        this.filteredByProducer = JSON.parse(window.localStorage.getItem("FILTERED"));
      }
  
      array = this.filteredByProducer;
  
    } else if (this.sortTriggered) {
       
      if (window.localStorage.getItem("SORTED")) {
        this.sortedByPrice = JSON.parse(window.localStorage.getItem("SORTED"));
      }
  
      array = this.sortedByPrice;
  
    } else {

        try {
          const response = await fetch(this.url);
          const response_data = await response.json();
          this.coffees = response_data;
          } catch(e) {
          console.log(e);
        }
         
       array = this.coffees;
  }
  
   if (array.length > 0) {
      for (i = 0; i < array.length; i++) {
        data += `<div class="col-md-4">
        <div id="${array[i].id}" class="card mb-4 box-shadow item-card text-center">
          <div class="card-body" style="margin: auto;">
            <img src="img/placeholder.jpg" />
            <h5 class="card-title"><strong>${array[i].price} UAH</strong></h5>
            <p class="card-text">Producer: ${array[i].producer}<br>
              Variety: ${array[i].variety} | Packing: ${array[i].packing}<br>
              Roasting: ${array[i].roasting} | Capacity: ${array[i].capacity}<br></p>
              <p class="card-text" style="text-align: justify;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eleifend cursus
              nibh, dignissim interdum tortor fermentum nec.</p>
            <div class="btn-group">
              <button type="button" class="btn btn-sm btn-outline-dark" onclick="app.Edit(${array[i].id})">Edit</button>
              <button type="button" class="btn btn-sm btn-outline-dark" onclick="app.Delete(${array[i].id})">Remove</button>
            </div>
          </div>
        </div>
        </div>`;
    }
  }

  this.Count(array.length);
  this.CountPrice(array);
  this.CountBrasilianProducts(array);

  this.filteredByProducer = [];
  this.sortedByPrice = [];
  window.localStorage.removeItem("FILTERED");
  window.localStorage.removeItem("SORTED");

  return this.el.innerHTML = data;
  };
  
    //////////////////////////////////////////////
  
    // CREATE ITEM
  
    this.Add = async function () {
      price = Number(document.getElementById('add-price').value);
      producer = document.getElementById('add-producer').value;
      variety = document.getElementById('add-variety').value;
      packing = document.getElementById('add-packing').value;
      roasting = document.getElementById('add-roasting').value;
      capacity = Number(document.getElementById('add-capacity').value);
    
      var new_item = {
          price: price,
          producer: producer,
          variety: variety,
          packing: packing,
          roasting: roasting,
          capacity: capacity
      };
      
      const res = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(new_item)
      })
      .then(() => {
        console.log('triggered');
        console.log(JSON.stringify(new_item));
        window.location.href = "./index.html";
      })
      .catch((error) => console.log(error));
        
    
      price = '';
      producer = '';
      variety = '';
      packing = '';
      roasting = '';
      capacity = '';
        
      this.FetchAll();
    };
    
  
    //////////////////////////////////////////////
  
    // UPDATE ITEM
  
    this.Edit = async function (item) {
      price = document.getElementById('edit-price');
      producer = document.getElementById('edit-producer');
      variety = document.getElementById('edit-variety');
      packing = document.getElementById('edit-packing');
      roasting = document.getElementById('edit-roasting');
      capacity = document.getElementById('edit-capacity');

    var current_item = null;

    for(i = 0; i < this.coffees.length; i++) {

      if(this.coffees[i].id == item) {
        current_item = this.coffees[i];
        break;
      }
    }
  
    price.value = Number(current_item.price);
    producer.value = current_item.producer;
    variety.value = current_item.variety;
    packing.value = current_item.packing;
    roasting.value = current_item.roasting;
    capacity.value = Number(current_item.capacity)
  
    document.getElementById('edit-spoiler').style.display = 'block';
    self = this;
    
    document.getElementById('saveEdit').onsubmit = async function() {
  
      price = Number(document.getElementById('edit-price').value);
      producer = document.getElementById('edit-producer').value;
      variety = document.getElementById('edit-variety').value;
      packing = document.getElementById('edit-packing').value;
      roasting = document.getElementById('edit-roasting').value;
      capacity = Number(document.getElementById('edit-capacity').value);

      var updatedObject = {
        price: price,
        producer: producer,
        variety: variety,
        packing: packing,
        roasting: roasting,
        capacity: capacity
      };
    
      await fetch(self.url + '/' + item, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(updatedObject),
      })
        .catch((error) => console.log(error));

        self.FetchAll();
        self.CloseInput();
    }
  };
  
    ////////////////////////////////////////////
  
   // DELETE ITEM
  
   this.Delete = async function (item) {
    await fetch(this.url + '/' + item, {
      method: 'DELETE',
    })
      .catch((error) => console.log(error));
    this.FetchAll();
  
  };
    ////////////////////////////////////////////
  
    //                                         //
     //                 UTIL                   //
       //                                      //
  
  
    // SEARCH (FILTER) BY PRODUCER
  
    this.SearchByProducer = function() {
      console.log('search triggered');
      producer = document.getElementById('search-producer').value;
      this.searchTriggered = false;
    
    if (producer) {
      for (i = 0; i < this.coffees.length; i++) {
        if (this.coffees[i].producer.toUpperCase() === producer.toUpperCase()) {
          this.filteredByProducer.push(this.coffees[i]);
          console.log('added', this.coffees[i]);
          window.localStorage.setItem("FILTERED", JSON.stringify(this.filteredByProducer));
        }
      }
    
      producer = '';
    
      this.searchTriggered = true;
      }
      this.FetchAll();
      this.searchTriggered = false;
    };
  
    //////////////////////////////////////////////
  
    // SORT  BY PRICE
  
  this.BubbleSortByPrice = function() {
    this.sortedByPrice = this.coffees;
  
    for (i = 0; i < this.sortedByPrice.length; i++) {
      swapped = false;
      for (current_pos = 0; current_pos < this.sortedByPrice.length - i - 1; current_pos++) {
        if(this.sortedByPrice[current_pos].price > this.sortedByPrice[current_pos+1].price) {
          temp = this.sortedByPrice[current_pos];
          this.sortedByPrice[current_pos] = this.sortedByPrice[current_pos+1];
          this.sortedByPrice[current_pos+1] = temp;
          swapped = true;
        }
      }
      if (!swapped) {
        break;
      }
    }
    window.localStorage.setItem("SORTED", JSON.stringify(this.sortedByPrice));
  
    this.sortTriggered = true;
    this.FetchAll();
    this.sortTriggered = false;  
  };
  
    //////////////////////////////////////////////
  
    // CLEAR THE LIST
  
    this.Clear = async function() {
      console.log(this.coffees);
      for (i = 0; i < this.coffees.length; i++) {
        this.Delete(this.coffees[i].id);
      }
      this.FetchAll();
      this.searchTriggered = false;
    };
  
    //////////////////////////////////////////////
  
    // CLOSE EDIT
  
    
  this.CloseInput = function() {
    document.getElementById('edit-spoiler').style.display = 'none';
  };
  
  this.StopSearch = function() {
    document.getElementById('search-producer').value = '';
    this.filteredByProducer = [];
    window.localStorage.removeItem("FILTERED");
  };
  
    //////////////////////////////////////////////
  
    // DISPLAY ADD FORM
  
  this.DisplayAddForm = function() {
    if (document.getElementById('add-form').style.display === 'none') {
      document.getElementById('add-form').style.display = 'block';
    } else {
      document.getElementById('add-form').style.display = 'none';
    }
  };
  
    //////////////////////////////////////////////
  
    // ADD FORM DATA VALIDATION
  
  document.getElementById('add-form').addEventListener('invalid', (function () {
    return function (e) {
      e.preventDefault();
      var modal = document.getElementById('add-modal');
      var span = document.getElementsByClassName('close')[0];
      
      modal.style.display = 'block';
        
      span.onclick = function() {
        modal.style.display = 'none';
      }
  
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = 'none';
        }
      }
    };
  })(), true);
  
    //////////////////////////////////////////////
  
    // EDIT FORM DATA VALIDATION
  
  document.getElementById('edit-spoiler').addEventListener('invalid', (function () {
    return function (e) {
      e.preventDefault();
      var modal = document.getElementById('edit-modal');
      var span = document.getElementsByClassName('close')[0];
        
      modal.style.display = 'block';
        
      span.onclick = function() {
        modal.style.display = 'none';
      }
  
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = 'none';
        }
      }
    };
  })(), true);

}; 
  
app.FetchAll()