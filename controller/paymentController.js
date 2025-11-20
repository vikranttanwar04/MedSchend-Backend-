// import Razorpay from 'razorpay';

// const razorpay = new Razorpay({
//     key_id: hkjhkjgj,
//     key_secret: khkhkjhkhk,
// })

// export const createPaymentOrder = async(req, res) => {
//     try{
//         const { fee } = req.body;
    
//         const order = await razorpay.orders.create({
//             amount: fee * 100,
//             currency: "INR",
//             receipt: `receipt_${Date.now()}`,
//         });

//         res.json(order);
//     }catch(err){
//         console.error(err);
//         res.status(500).json({ message: "Payment order creation failed!" });
//     }
// }