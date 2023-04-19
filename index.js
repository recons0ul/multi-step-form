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

  isActiveNodeLastItem() {
    return this.activeNode.next === null;
  }
}

let activeContentList = new LinkedList();
// Add content IDs
activeContentList.addItem("#info", ".nav-1");
activeContentList.addItem("#plan", ".nav-2");
activeContentList.addItem("#addons", ".nav-3");
activeContentList.addItem("#summary", ".nav-4");
activeContentList.addItem("#confirm", ".nav-4");

let isYearlyToggled = true;

$(".next-btn").click(() => {
  let activeNode = activeContentList.getActiveNode();

  if (activeNode.page_id === "#info") {
    if (!validateInputs()) {
      return;
    }

    resetErrorState();
  }

  if (activeContentList.isActiveNodeFirstItem()) {
    $(".back-btn").removeClass("visibility-hidden");
  }

  $(activeNode.page_id).addClass("hidden");
  $(activeNode.nav_elem).removeClass("nav-active");
  activeContentList.next();

  if (activeContentList.isActiveNodeLastItem()) {
    $(".next-btn").addClass("visibility-hidden");
  }

  activeNode = activeContentList.getActiveNode();

  $(activeNode.page_id).removeClass("hidden");
  $(activeNode.nav_elem).addClass("nav-active");
});

$(".back-btn").click(() => {
  if (activeContentList.isActiveNodeLastItem()) {
    $(".next-btn").removeClass("visibility-hidden");
  }

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
});

function validateInputs() {
  if ($("#name").val() === "") {
    $("#name").addClass("error-outline");
    $(".input-error-name").removeClass("hidden");
    $(".input-error-name").text("This field is required");
    return false;
  }

  if ($("#mail").val() === "") {
    $("#mail").addClass("error-outline");
    $(".input-error-mail").removeClass("hidden");
    $(".input-error-mail").text("This field is required");
    return false;
  }

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test($("#mail").val())) {
    $("#mail").addClass("error-outline");
    $(".input-error-mail").removeClass("hidden");
    $(".input-error-mail").text("You have entered an invalid email address!");
    return false;
  }

  if ($("#phone-number").val() === "") {
    $("#phone-number").addClass("error-outline");
    $(".input-error-phone").removeClass("hidden");
    $(".input-error-phone").text("This field is required");
    return false;
  }

  let isnum = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test($("#phone-number").val());

  if (!isnum) {
    $("#phone-number").addClass("error-outline");
    $(".input-error-phone").removeClass("hidden");
    $(".input-error-phone").text("You have entered an invalid phone number!");
    return false;
  }

  return true;
}

function resetErrorState() {
  $("#name").removeClass("error-outline");
  $(".input-error-name").addClass("hidden");
  $("#mail").removeClass("error-outline");
  $(".input-error-mail").addClass("hidden");
  $("#phone-number").removeClass("error-outline");
  $(".input-error-phone").addClass("hidden");
}
