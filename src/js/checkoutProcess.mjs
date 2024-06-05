import { qs, getLocalStorage } from "../js/utils.mjs"

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
  }

  
};



export default checkoutProcess;