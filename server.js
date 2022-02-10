const express = require("express");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");

const app = express();
const date = require("./date.js");
const userModal = require('./modals/user')
const routModal = require('./modals/rout');
const paymentModal = require("./modals/payment.js");

app.use(express.json(), express.static('public'));  //to convert body parameter to json
// app.use(express.urlencoded({ extended: true })); //to convert query parameter to json
// app.use(express.static('public')); // to serve public resources
app.set('view engine', 'ejs'); // to register ejs as render engine
app.route('/css', express.static(__dirname + 'public/css'))
//connection of database
mongoose.connect("mongodb://localhost:27017/express-mongoose", { useNewUrlParser: true }).then((res, err) => {
    if (err)
        console.log(err);
}).catch(err => {
    console.log(err);
});

const instance = new Razorpay({ key_id: 'rzp_test_gGL8rDnl6Cic1b', key_secret: 'FgIwFGpY68CEBkYBMd4MwTDA' })


async function createPayment(user, amt) {
    try {
        return await paymentModal.create({ user: new mongoose.Types.ObjectId(user), amt, date: date() })
    } catch (error) {
        console.log(error)
        return false
    }
}

async function createUser(name, mobile) {
    try {
        return await userModal.create({ mobile, name })
    } catch (error) {
        console.log(error)
        return false
    }
}

app.post('/test', async (req, res) => {
    //test function here
    let user = await createPayment('moorthy', '9876543210');
    console.log(user)
    res.send(user)
})

app.post('/confirmPayment', async (req, res) => {
    console.log("payment confirmation")
    console.log(req.body)
    paymentModal.findOneAndUpdate({ orderId: req.body.PaymentOrderId }, { success: true })
    res.json({ status: true })
})

function updatePayment(id, orderId) {
    console.log('payment update');
    console.log(id, orderId);
    paymentModal.findByIdAndUpdate(id, { orderId })
}

app.post('/payment', async (req, res) => {
    const { name, mobile, amt } = req.body;

    //create user to identify who made payment based on mobile number
    user = await createUser(name, mobile)
    // if (!user)
    //     return res.status(500).json({ status: false, msg: "couldn't create user" })

    //create payment for razorpay order_id 
    payment = await createPayment(user._id, amt);
    // if (!payment)
    //     return res.status(500).json({ status: false, msg: "couldn't create payment" })

    //initate payment with razorpay 
    var options = {
        amount: amt + "00",  // amount in the smallest currency unit
        currency: "INR",
        receipt: `receipt_${payment._id}` //put mongo db id here
    };
    try {
        instance.orders.create(options, function (err, order) {
            if (err)
                // throw err;
                console.log(err);
            console.log(order);
            res.json({ status: true, order_id: order.id });
            updatePayment(payment._id, order.id)
        });
    } catch (error) {
        console.log(error);
        // return res.status(500).json({ status: false, msg: "couldn't initiate payment" })
    }

})

//for geting to nav bar and rendering
app.get('/', (req, res) => {
    const price = 450;
    res.render('index', { price, date: date() });
})

app.post('/loginVerify', (req, res) => {
    const { user, pass } = req.body;
    if (user == "admin" && pass == "admin")
        return res.json({ status: true })
    return res.json({ status: false })
})

//use for show price from db
app.get('/getPrice', (req, res) => {
    const { start, end } = req.query;
    console.log(start, end);
    routModal.findOne({ start, end }).then(succ => {
        console.log('success', succ);
        if (succ)
            res.json(succ);
        else
            res.status(404).json({ msg: "Not found" });

    }).catch(err => {
        console.log(err);
        res.status(500).json({ msg: "something went wrong" });
    });
})



app.post('/', (req, res) => {
    console.log('body', req.body);
    userModal.create({ name: req.body.name, mobilenumber: req.body.number }).then(succ => {
        console.log('success', succ);
        res.render('index', { price: 0, date: date() });
    }).catch(err => {
        console.log(err);
        res.status(500).render('index', { date: date() })
    });
});

app.get('/login', (req, res) => res.render('login'))
app.get('/contact', (req, res) => res.render('contact'))
app.get('/admin', (req, res) => res.render('admin'))

//testing purpose
app.post('/api/', (req, res) => {
    console.log(req.query);



    res.json({ ...req.body, ...req.query, msg: "Thank you " })
})

app.get('/test', (req, res) => res.render('test', { name: req.query.name }))




//conection for server
app.listen(80, function () {
    console.log("the server 80 is just startes");
});



