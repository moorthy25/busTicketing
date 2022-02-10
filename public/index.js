const headers = {
    'Content-Type': 'application/json'
};

const route = {
    start: null,
    end: null,
}
const data = { price: null }

const start = document.querySelector('#rout-select-start');
const end = document.querySelector('#rout-select-end');
const price = document.querySelector('#price');
const Uname = document.querySelector('#userName');
const mobile = document.querySelector('#mobile');

start.addEventListener('change', () => {
    route.start = start.value;
    console.log(start.value);
    fetchPrice();
})
end.addEventListener('change', () => {
    route.end = end.value;
    console.log(end.value);
    fetchPrice();
})

function fetchPrice() {
    const { start, end } = route;
    if (start == end) {
        alert("Start and destination location can't be same");
        end.selectedIndex = 0;
        return
    }
    if (start && end)
        fetch(`/getPrice?start=${start}&end=${end}`).then((res) => res.json()).then((res) => {
            console.log(res);
            data.price = res.price;
            price.innerHTML = res.price
        }).catch(err => {
            console.error(err);
            alert('something went wrong');
        });


}
let PaymentOrderId=null;
async function paymentResponse(res) {
    await fetch('/confirmPayment', {
        method: "POST",
        headers,
        body: JSON.stringify({ PaymentOrderId, ...res })
    })
    alert('your payment has done')
    //do further in this section
}

async function initiatePayment() {
    const payRes = await fetch('/payment', {
        method: "POST",
        headers,
        body: JSON.stringify({ name: Uname.value, mobile: mobile.value, amt: data.price })
    })
    if (!payRes.status)
        return alert(payRes.msg);
    PaymentOrderId = payRes.order_id;
    var options = {
        "key": "rzp_test_gGL8rDnl6Cic1b",
        "amount": data.price + "00",
        "currency": "INR",
        "name": "Dennis Corp",
        "description": "Test Transaction",
        "image": "https://us.123rf.com/450wm/pgmart/pgmart1604/pgmart160400043/55602236-capital-letter-d-from-the-white-interwoven-strips-on-a-black-background-template-for-emblem-logos-an.jpg?ver=6",
        "order_id": payRes.order_id,
        "handler": paymentResponse,
        "prefill": {
            "name": Uname.value,
            // "email": "gaurav.kumar@example.com",
            "contact": mobile.value
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#212529"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response) {
        alert(response.error.reason);
    });
    rzp1.open();
}
document.getElementById('rzp-button1').onclick = function (e) {
    e.preventDefault();
    initiatePayment();
}