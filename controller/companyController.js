const mongoose = require('mongoose');
const companySchema = require('../models/companySchema')
const { unlinkSync } = require('fs');
const companyReviewSchema = require('../models/companyReviewSchema');

module.exports = {
    createCompany: async (req, res) => {
        const companyData = new companySchema(req.body)
        try {
            const companyExist = await companySchema.findOne({
                companyName: req.body.companyName,
            });
            companyData.companyName = req.body.companyName.trim().split(" ").map((data) => {
                return data.charAt(0).toUpperCase() + data.slice(1);
            }).join(" ")
            if (companyExist) {
                req.file ? unlinkSync(req.file.path) : null;
                res.status(401).send({
                    success: false,
                    message: 'Company allready exists',
                });
            }
            else {
                const filePath = `/uploads/${req.file.filename}`;
                companyData.profilePic = filePath;
                const company = await companyData.save()
                res.status(200).json({
                    success: true,
                    message: 'Company created',
                    companyDetails: company,
                });
            }
        }
        catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            })
        }
    },

    companyList: async (req, res) => {
        try {
            const companyOfList = await companySchema.find()
            const count = await companySchema.find().count();
            res.status(200).json({
                success: true,
                message: 'List Of Company',
                count: count,
                list: companyOfList,
            });

        }
        catch (err) {
            res.status(500).json({
                success: false,
                message: err.message
            })
        }
    },

    companyDetails: async (req, res) => {
        const id = req.params.id
        try {
            const companyData = await companySchema.findById(id)
            const reviewData = await companyReviewSchema
                .find({ companyId: id })
                .populate({ path: "userId", select: "userName profilePic" })
            res.status(200).send({
                success: true,
                message: 'Company details',
                company: companyData,
                review: reviewData
            })
        } catch (err) {
            res.status(200).send({
                success: false,
                message: 'Company Details Not Found',
                error: err.message
            })
        }
    },

    sortCompany: async (req, res) => {
        try {
            let sortedCompany = await companySchema.find().sort({ companyName: 1 })
            res.status(200).send({
                success: true,
                message: "Company List With Sorted Format 😎",
                data: sortedCompany
            })
        }
        catch (err) {
            res.status(500).send({
                success: false,
                message: "There was an Error 😶",
                error: err.message
            })
        }
    },

    searchCompany: async (req, res) => {
        const { letter } = req.params
        try {
            const searchData = await companySchema.find({ companyName: { $regex: `^${letter}`, $options: "i" } })
            if (searchData.length > 0) {
                res.status(200).send({
                    success: true,
                    message: "Company Found ✔",
                    data: searchData
                })
            } else {
                res.status(403).json({
                    success: false,
                    message: "Company Not Found 🙂"
                })
            }

        }
        catch (err) {
            res.status(500).send({
                success: false,
                message: "There was an Error 👀",
                error: err.message
            })
        }
    }
}