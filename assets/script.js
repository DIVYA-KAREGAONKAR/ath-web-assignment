document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("projectForm");

    if(form){
        form.addEventListener("submit", function(e){
            e.preventDefault();

            let name = document.getElementById("name").value.trim();
            let email = document.getElementById("email").value.trim();
            let title = document.getElementById("title").value.trim();
            let description = document.getElementById("description").value.trim();

            if(!name || !email || !title || !description){
                alert("All fields are required!");
                return;
            }

            localStorage.setItem("name", name);
            localStorage.setItem("email", email);
            localStorage.setItem("title", title);
            localStorage.setItem("description", description);

            window.location.href = "display.html";
        });
    }
});

