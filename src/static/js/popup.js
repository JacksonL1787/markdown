$(".menu-btn").click(() => {
    $("body").toggleClass("nav-active")
    $(".menu-btn").toggleClass("is-active")
})

$(".favorites-link-btn").click(() => {
    $("body").addClass("favorites-page-active")
    $(".similar-items-container, .favorites-container").removeAttr("style")
})

$(".settings-link-btn").click(() => {
    $("body").addClass("settings-page-active")
    $(".similar-items-container, .settings-container").removeAttr("style")
})

$(".back-btn").click(() => {
    $("body").removeClass("favorites-page-active").removeClass("settings-page-active").removeClass("nav-active")
    $(".menu-btn").removeClass("is-active")
    $(".similar-items-container").css("transition", "left .3s")
    $(".favorites-container, .settings-container").css("transition", "left .3s").css("left", "100%")
})

$(".theme-select").click(() => {
    $(".theme-select").toggleClass("active")
})