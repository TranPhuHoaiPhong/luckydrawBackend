import Spin from "../models/Spin.js"
import Prize from "../models/Prize.js"
import Admin from "../models/Admin.js"

class SpinService {
    async spinWheel(userId) {
        //  Lấy config admin
        let config = await Admin.findOne().sort({ createdAt: -1})

        if (!config) {
            config = {
                maxSpinsPerUser: 1000,   // số lượt mặc định mỗi user
                spinEnabled: true,    // bật sự kiện
                startTime: new Date(Date.now() - 1000), // bắt đầu ngay
                endTime: new Date(Date.now() + 24*60*60*1000) // kết thúc sau 24h
            };
        }

        // Check event
        if( !config.spinEnabled) {
            const error = new Error("The event not available")
            error.code = 400
            throw error
        }

        const now = new Date()
        if (config.startTime && now < config.startTime) {
            const error = new Error("The event does not begin")
            error.code = 400
            throw error
        }
        if (config.endTime && now > config.endTime) {
            const error = new Error("The event ended")
            error.code = 400
            throw error
        }

        // Check the spin number
        const userSpins = await Spin.countDocuments({ userId })
        if (config.maxSpinsPerUser && userSpins >= config.maxSpinsPerUser) {
            const error = new Error("Do not have any spin left")
            error.code = 400
            throw error
        }

        // Check prize 
        const prizes = await Prize.find({ quantity: { $gt: 0 }})

        if( prizes.length === 0 ) {
            // No prize
            const spin = await Spin.create({
                userId,
                prizeId: null,
                rewardType: "None"
            })

            return {
                message: "No prize available. Better luck next time",
                prize: null,
                spin
            }
        }

        //  random weighted acording to probability
        const totalprob = prizes.reduce((sum, p) => sum + p.probability, 0) 
        let random = Math.random() * totalprob

        let selectedPrize = null
        for (let p of prizes) {
            if(random < p.probability) {
                selectedPrize = p
                break
            }
            random -= p.probability
        }

        //  No prize
        if(!selectedPrize) {
            const spin = await Spin.create({
                userId,
                prizeId: null,
                rewardType: "none"
            })

             return {
                message: "Better luck next time",
                prize: null,
                spin
            };
        }

        //  minus the prize
        selectedPrize.quantity -= 1
        await selectedPrize.save()

        // save to the history
        const spin = await Spin.create({
            userId,
            prizeId: selectedPrize._id,
            rewardType: selectedPrize.type
        })

        return {
            message: "Spin success",
            prize: selectedPrize,
            spin
        };
    }
}

export default new SpinService()