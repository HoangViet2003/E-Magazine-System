const dbSequelize = require("../models/sequelize");

const Contribution= dbSequelize.contributions;

//creatContribution. get contribution, search contribution
const createContribution = async (req, res) => {
    const { FacultyId, Title, UploadDate, Status, AcademicYear, ClosureDate } = req.body;
    try {
        const contribution = await Contribution.create({
            FacultyId,
            Title,
            UploadDate,
            Status,
            AcademicYear,
            ClosureDate
        });
        return res.status(201).json(contribution);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


const getAllContributions = async (req, res) => {
    try {
        const contributions = await Contribution.findAll();
        return res.status(200).json(contributions);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createContribution, 
    getAllContributions
}