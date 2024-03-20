const {Contribution} = require('../models');
const {validateContribution} = require('../validations/validation');

const createContribution = async (req, res) => {
	const {error, value} =  validateContribution(req.body); 
    if(error) {
        console.log(error); 
        return res.send(error.details); 
    }
	
	try {

		const {
			facultyId,
			studentId,
			title,
			status,
		
		} = req.body;

        const uploadDate = new Date();
        const academicYear = new Date();
        const closureDate = new Date();

		const newContribution = new Contribution({
			facultyId,
			studentId,
			title,
			uploadDate,
			status,
			academicYear,
			closureDate,
		});

		await newContribution.save();

		res.status(201).json({
			status: "success",
			data: newContribution,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}

}

const getAllContributions = async (req, res) => {
	try {
		const contributions = await Contribution.find();
		res.status(200).json({
			status: "success",
			data: contributions,
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
const editContribution = async(req, res)=>{
	const {error, value} = validateContribution(req.body); 
	if(error) {
		console.log(error); 
		return res.send(error.details); 
	}
	try{
        const editcontribution = await Contribution.findByIdAndUpdate(req.params.id, req.body, {new: true});
		return res.status(200).json({
			status: "edit successed", 
			data: editcontribution, 
		})
	}catch(error){
     return res.status(500).json({error: error.message});
	}
}

const deleteContribution = async(req, res) =>{
    try{
        await Contribution.findByIdAndDelete(req.params.id, req.body); 
        return res.status(200).send("delete contribution succeesful"); 
    }catch(error){
        return res.status(500).json({error: error.message}); 
    }
}

module.exports = {
    createContribution,
    getAllContributions, 
	editContribution,
	deleteContribution, 
}