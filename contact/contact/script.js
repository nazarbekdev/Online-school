document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    const captcha = document.getElementById('captcha').value;

    console.log({
        name,
        email,
        subject,
        message,
        captcha
    });

    alert("Xabaringiz yuborildi!");
});
