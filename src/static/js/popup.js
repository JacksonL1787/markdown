$(".menu-btn").click(() => {
    $("body").toggleClass("nav-active")
    $(".menu-btn").toggleClass("is-active")
})

$(".favorites-link-btn").click(() => {
    $("body").addClass("favorites-page-active")
    $(".similar-items-container, .favorites-container").removeAttr("style")
})

$(".favorites-container .back-btn").click(() => {
    $("body").removeClass("favorites-page-active").removeClass("nav-active")
    $(".menu-btn").removeClass("is-active")
    $(".similar-items-container").css("transition", "left .3s")
    $(".favorites-container").css("transition", "left .3s").css("left", "100%")
})