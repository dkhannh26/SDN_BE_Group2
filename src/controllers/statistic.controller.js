const Order_details = require("../models/order_details");
const Orders = require("../models/orders");
const Pant_shirt_size_detail = require("../models/pant_shirt_size_detail");

const getStatistic = async (req, res, next) => {
    try {
        const year = req.params.year

        const startDate = new Date(`${year}-01-01T00:00:00Z`);
        const endDate = new Date(`${year}-12-31T23:59:59Z`);


        const orders = await Orders.find({
            createdAt: {
                $gte: startDate,
                $lte: endDate,
            }
        });

        const products = await Order_details.find({
            createdAt: {
                $gte: startDate,
                $lte: endDate,
            }
        });

        const totalByMonth = orders.reduce((acc, item) => {
            const monthYear = item.createdAt.toISOString().slice(5, 7); // Lấy tháng và năm (YYYY-MM)

            if (!acc[monthYear]) {
                acc[monthYear] = 0; // Khởi tạo nếu chưa có
            }

            acc[monthYear] += item.total_price; // Cộng số lượng vào tháng tương ứng
            return acc;
        }, {});

        console.log(totalByMonth);

        const revenue = orders
            .map(order => order.total_price)
            .reduce((acc, price) => acc + price, 0);

        const countAccessory = products.reduce((sum, item) => {
            if (item.accessory_id) {
                return sum + item.quantity;
            }
            return sum;
        }, 0);

        const countShoes = products.reduce((sum, item) => {
            if (item.shoes_size_detail_id) {
                return sum + item.quantity;
            }
            return sum;
        }, 0);
        const countTshirtPants = products.reduce((sum, item) => {
            if (item.pant_shirt_size_detail_id) {
                return sum + item.quantity;
            }
            return sum;
        }, 0);

        const TshirtPants = products.filter(item => item.pant_shirt_size_detail_id !== null);
        let countTshirt = 0
        let countPant = 0
        await Promise.all(TshirtPants.map(async item => {
            const id = item.pant_shirt_size_detail_id;
            const Tshirt = await Pant_shirt_size_detail.findOne({ _id: id });

            if (Tshirt?.tshirt_id) {
                countTshirt += item.quantity;
            } else {
                countPant += item.quantity;
            }
        }));

        const uniqueAccountIds = new Set(
            orders
                .map(order => order.account_id + '')
            // .filter(accountId => accountId !== undefined)
        );

        console.log(uniqueAccountIds.size);

        const rs = {
            revenue: revenue,
            products: products.length,
            orders: orders.length,
            ordersByMonth: totalByMonth,
            accountNumber: uniqueAccountIds.size,
            tshirtsNumber: countTshirt,
            pantsNumber: countPant,
            shoesNumber: countShoes,
            accessories: countAccessory,
        }

        res.json(rs)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { getStatistic }