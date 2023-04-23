// Price constants
const ARCADE_PRICE_YEARLY = "$90/yr";
const ARCADE_PRICE_MONTHLY = "$9/mo";
const ADVANCED_PRICE_YEARLY = "$120/yr";
const ADVANCED_PRICE_MONTHLY = "$12/mo";
const PRO_PRICE_YEARLY = "$150/yr";
const PRO_PRICE_MONTHLY = "$15/mo";

const ONLINE_SERVICE_PRICE_YEARLY = "+$10/yr";
const ONLINE_SERVICE_PRICE_MONTHLY = "+$1/mo";
const STORAGE_PRICE_YEARLY = "+$20/yr";
const STORAGE_PRICE_MONTHLY = "+$2/mo";
const CUSTOMIZABLE_PRICE_YEARLY = "+$20/yr";
const CUSTOMIZABLE_PRICE_MONTHLY = "+$2/mo";

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
  resetErrorState();
  if (activeNode.page_id === "#info") {
    if (!validateInputs()) {
      return;
    }
  }

  if (activeContentList.isActiveNodeFirstItem()) {
    $(".back-btn").removeClass("visibility-hidden");
  }

  $(activeNode.page_id).addClass("hidden");
  $(activeNode.nav_elem).removeClass("nav-active");
  activeContentList.next();

  activeNode = activeContentList.getActiveNode();

  if (activeNode.page_id === "#summary") {
    // aggregate information from all pages

    const planType = $(".plan-radiobutton")
      .filter(function () {
        return $(this).prop("checked");
      })
      .next()
      .find("h4")
      .text();

    const planPrice = $(".plan-radiobutton")
      .filter(function () {
        return $(this).prop("checked");
      })
      .next()
      .find(".plan-price-item")
      .text();

    const isMonthly = $(".plan-checkbox").is(":checked");
    let planName = planType + " (" + (isMonthly ? "Monthly" : "Yearly") + ")";
    console.log(planName);

    $(".summary-plan").text(planName);
    $(".summary-plan-price").text(planPrice);

    // Collect selected addons
    let sum = +planPrice.match(/\d+/);
    $(".selectable-addons")
      .find("input[type=checkbox]:checked")
      .next(".online-service")
      .each((_, el) => {
        const ADDON_NAME = $(el).find("h4").text();
        let addon_price;
        if (isMonthly) {
          addon_price = ONLINE_SERVICE_PRICE_MONTHLY;
        } else {
          addon_price = ONLINE_SERVICE_PRICE_YEARLY;
        }

        sum += +addon_price.match(/\d+/);

        $(".addon-list").append(
          '<li class="addon-list-item">' + `<p>${ADDON_NAME}</p>` + `<p>${addon_price}</p>` + "</li>"
        );
      });

    $(".selectable-addons")
      .find("input[type=checkbox]:checked")
      .next(".storage")
      .each((_, el) => {
        const ADDON_NAME = $(el).find("h4").text();
        let addon_price;
        if (isMonthly) {
          addon_price = STORAGE_PRICE_MONTHLY;
        } else {
          addon_price = STORAGE_PRICE_YEARLY;
        }
        sum += +addon_price.match(/\d+/);

        $(".addon-list").append(
          '<li class="addon-list-item">' + `<p>${ADDON_NAME}</p>` + `<p>${addon_price}</p>` + "</li>"
        );
      });

    $(".selectable-addons")
      .find("input[type=checkbox]:checked")
      .next(".customizable")
      .each((_, el) => {
        const ADDON_NAME = $(el).find("h4").text();
        let addon_price;
        if (isMonthly) {
          addon_price = CUSTOMIZABLE_PRICE_MONTHLY;
        } else {
          addon_price = CUSTOMIZABLE_PRICE_YEARLY;
        }
        sum += +addon_price.match(/\d+/);

        $(".addon-list").append(
          '<li class="addon-list-item">' + `<p>${ADDON_NAME}</p>` + `<p>${addon_price}</p>` + "</li>"
        );
      });

      if (isMonthly) {
        $(".summary-item-price").text("+$" + sum + "/mo");
      } else {
        $(".summary-item-price").text("+$" + sum + "/yr");
      }
  }

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

  if (activeNode.page_id === "#summary") {
    // remove addon items
    $(".addon-list-item").remove();
  }

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
  $(".plan-benefit").toggle("hidden");
  if (isYearlyToggled) {
    // monthly will be toggled now
    $(".arcade-plan .plan-price-item").text(ARCADE_PRICE_MONTHLY);
    $(".advanced-plan .plan-price-item").text(ADVANCED_PRICE_MONTHLY);
    $(".pro-plan .plan-price-item").text(PRO_PRICE_MONTHLY);

    $(".addon-option.online-service .addon-price").text(ONLINE_SERVICE_PRICE_MONTHLY);
    $(".addon-option.storage .addon-price").text(STORAGE_PRICE_MONTHLY);
    $(".addon-option.customizable .addon-price").text(CUSTOMIZABLE_PRICE_MONTHLY);
    console.log("-> monthly");
  } else {
    // yearly will be toggled now
    $(".arcade-plan .plan-price-item").text(ARCADE_PRICE_YEARLY);
    $(".advanced-plan .plan-price-item").text(ADVANCED_PRICE_YEARLY);
    $(".pro-plan .plan-price-item").text(PRO_PRICE_YEARLY);

    $(".addon-option.online-service .addon-price").text(ONLINE_SERVICE_PRICE_YEARLY);
    $(".addon-option.storage .addon-price").text(STORAGE_PRICE_YEARLY);
    $(".addon-option.customizable .addon-price").text(CUSTOMIZABLE_PRICE_YEARLY);
    console.log("-> Yearly");
  }
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

$(".summary-plan-change").click(() => {

  $(".addon-list-item").remove();

  let activeNode = activeContentList.getActiveNode();

  $(activeNode.page_id).addClass("hidden");
  $(activeNode.nav_elem).removeClass("nav-active");

  // Go two steps back to change selected plan
  activeContentList.prev();
  activeContentList.prev();

  activeNode = activeContentList.getActiveNode();

  $(activeNode.page_id).removeClass("hidden");
  $(activeNode.nav_elem).addClass("nav-active");
})
