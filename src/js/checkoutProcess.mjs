import { qs, getLocalStorage, formatCurrency } from "./utils.mjs"
import { checkout } from "./externalServices.mjs"
import { calculateTotal } from "./shoppingCart.mjs"

 const checkoutProcess = {

  storageKey: "",
  selector: "",
  list: [],
  itemTotal: 0,
  shipping: 0,
  tax: 0,
  orderTotal: 0,
  itemCount: 0,

  init: function(storageKey, selector) {
    this.storageKey = storageKey;
    this.selector = selector;
    this.list = getLocalStorage(storageKey);
    this.calculateItemSummary();
  },

  calculateItemSummary: function() {
    // calculate and display the total amount of the items in the cart, and the number of items.

    this.itemTotal = calculateTotal(this.list);

    this.calculateOrdertotal();

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

    this.itemCount = count;
    
    this.tax = this.itemTotal * 0.06;

    this.orderTotal = this.itemTotal + this.tax + this.shipping;
    
    this.displayOrderTotals();
  },

  displayOrderTotals: function() {
    // once the totals are all calculated display them in the order summary page
    
    
    qs("#subtotal-label").textContent = this.itemCount;

    qs("#subtotal").textContent = formatCurrency(this.itemTotal);

    qs("#shipping-estimate").textContent = formatCurrency(this.shipping);

    qs("#tax").textContent = formatCurrency(this.tax);

    qs("#order-total").textContent = formatCurrency(this.orderTotal);

  },
  
  

  

  async checkout(form) {
    let order = {
      orderDate: new Date(),
      fname: form.elements.fname.value,
      lname: form.elements.lname.value,
      street: form.elements.street.value,
      city: form.elements.city.value,
      state: form.elements.state.value,
      zip: form.elements.zip.value,
      cardNumber: form.elements.cardNumber.value,
      expiration: form.elements.expiration.value,
      code: form.elements.code.value,
      items: packageItems(this.list),
      orderTotal: this.orderTotal,
      shipping: this.shipping,
      tax: this.tax
    }

    const res = await checkout(order);
    //TODO Check the result of checkout and redirect to a order comfirmation page?
    //res contains a message and an orderId. 
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