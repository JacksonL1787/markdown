$(".favorites-btn").click(() => {
    $("#nav-container").addClass("favorites-page").removeClass("similar-items-page")
    $(".page-container").removeClass("active")
    $("#favorites-container").addClass("active")
})

$(".back-btn").click(() => {
    $("#nav-container").removeClass("favorites-page").addClass("similar-items-page")
    $(".page-container").removeClass("active")
    $("#similar-items-container").addClass("active")
})

$(".nav-items .item").mouseenter(function() {
    $(this).addClass("left").removeClass("right").addClass("active")
})

$(".nav-items .item").mouseleave(function() {
    $(this).removeClass("left").addClass("right").removeClass("active")
})

