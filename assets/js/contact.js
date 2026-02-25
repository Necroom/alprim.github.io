//  initializing my pyblic key from emailjs
 (function(){
    emailjs.init("SAIoJinDe9T9pNif0");
  })();

//   get elements from form
window.onload = function() {
    const form = document.querySelector("form");

    form.addEventListener("submit", function(event){
        event.preventDefault();

        const templateParams = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            // subject: document.getElementById("subject").value,
            message: document.getElementById("message").value
        };
    
    emailjs.send('service_efbd04d','template_nqv6xgh',templateParams) 
    .then(function(response){
        alert("Email sent succesfully!");
        console.log("SUCCESS", response.status, response.text);
    },  function(error) {
         alert("Ошибка при отправке");
        console.log("Failed", error);
    }
    );

    });
};
