import SpinService from "../services/Spin.js"

class SpinController {
    async spin(req, res) {
        try {
            const id = req.userId
            const result = await SpinService.spinWheel(id)
            res.status(201).json(result)
        } catch (error) {
            if( error.code === 400) {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ error: error.message})
        }
    }

    async getHistory(req, res) {
        try {
        const userId = req.user.id;

        const history = await Spin.find({ userId })
            .populate("prizeId")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            spins: history
        });
        } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
        }
  }
}

export default new SpinController()