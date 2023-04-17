class Node {
  constructor(page_id, nav_elem, prev = null, next = null) {
    (this.page_id = page_id), (this.prev = prev);
    this.nav_elem = nav_elem;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.activeNode = null;
  }

  addItem(page_id, nav_elem) {
    if (this.activeNode === null) {
      this.activeNode = new Node(page_id, nav_elem);
    } else {
      // search for last elem
      let currentNode = this.activeNode;
      let nextNode = this.activeNode.next;
      while (nextNode !== null) {
        currentNode = nextNode;
        nextNode = currentNode.next;
      }

      // last element is found -> add page_id
      let newElem = new Node(page_id, nav_elem, currentNode);
      currentNode.next = newElem;
    }
  }

  next() {
    this.activeNode = this.activeNode.next;
  }

  prev() {
    this.activeNode = this.activeNode.prev;
  }

  getActiveNode() {
    return this.activeNode;
  }

  isActiveNodeFirstItem() {
    return this.activeNode.prev === null;
  }
}

let activeContentList = new LinkedList();
// Add content IDs
activeContentList.addItem("#info", ".nav-1");
activeContentList.addItem("#plan", ".nav-2");
activeContentList.addItem("#addons", ".nav-3");

let isYearlyToggled = true;

$(".next-btn").click(() => {
  if (activeContentList.isActiveNodeFirstItem()) {
    $(".back-btn").removeClass("visibility-hidden");
  }
  let activeNode = activeContentList.getActiveNode();
  $(activeNode.page_id).addClass("hidden");
  $(activeNode.nav_elem).removeClass("nav-active");
  activeContentList.next();
  activeNode = activeContentList.getActiveNode();

  $(activeNode.page_id).removeClass("hidden");
  $(activeNode.nav_elem).addClass("nav-active");
});

$(".back-btn").click(() => {
  let activeNode = activeContentList.getActiveNode();

  $(activeNode.page_id).addClass("hidden");
  $(activeNode.nav_elem).removeClass("nav-active");

  activeContentList.prev();

  activeNode = activeContentList.getActiveNode();

  $(activeNode.page_id).removeClass("hidden");
  $(activeNode.nav_elem).addClass("nav-active");
  if (activeContentList.isActiveNodeFirstItem()) {
    $(".back-btn").addClass("visibility-hidden");
  }
});

$(".plan-checkbox").click(() => {
  isYearlyToggled = $(".plan-checkbox").prop("checked");
  $(".yearly-item").toggle("hidden");
  $(".monthly-item").toggle("hidden");
})
