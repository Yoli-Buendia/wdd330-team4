import { qs, getLocalStorage } from "../js/utils.mjs"
import { checkout } from "../js/externalServices.mjs"

 const checkoutProcess = {

  storageKey: "",
  selector: "",
  list: [],
  itemTotal: 0,
  shipping: 0,
  tax: 0,
  orderTotal: 0,

  init(storageKey, selector) {
    this.storageKey = storageKey;
    this.selector = selector;
    this.list = getLocalStorage(storageKey);
    this.calculateItemSummary();
  },

  displayOrderTotals: () => {
    // once the totals are all calculated display them in the order summary page
    const total = qs("#order-total");
    total.textContent = this.orderTotal;
  },
  
  calculateOrdertotal: function() {
    this.shipping = 10;
    let count = 0;
    if(this.list){
      this.list.forEach((item) => count += item.Quantity);
    }
    if(count > 1) {
      this.shipping += (count - 1) * 2;
    }
    
    this.tax = this.itemTotal * 1.06;

    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    
    this.displayOrderTotals();
  },

  calculateItemSummary: function() {
  },

  async checkout(form) {
    let order = {
      orderDate: new Date(),
      fname: form.elements.fname,
      lname: form.elements.lname,
      street: form.elements.steet,
      city: form.elements.city,
      state: form.elements.state,
      zip: form.elements.zip,
      cardNumber: form.elements.cardNumber,
      expiration: form.elements.expiration,
      code: form.elements.code,
      items: packageItems(this.list),
      orderTotal: this.orderTotal,
      shipping: this.shipping,
      tax: this.tax
    }


    await checkout(order);
  }
  
};

function packageItems(items) {
  let cart = items.map((item) =>{  
  const simpleItem = {
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: item.Quantity
}
return simpleItem;
});
return cart;  
}



export default checkoutProcess;