const btAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        "</div>",
    ].join("");

    document.getElementById("liveAlertPlaceholder").append(wrapper);
    setTimeout(function () {
        const btn = document.getElementsByClassName("btn-close")[0];
        btn.click();
    }, 10000)
};
