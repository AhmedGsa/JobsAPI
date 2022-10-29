const Job = require("../models/Job")
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, NotFoundError } = require("../errors/index")

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userID }).sort("createdAt")
    res.status(StatusCodes.OK).json({ count: jobs.length, jobs })
}

const getJob = async (req, res) => {
    const { id } = req.params
    const job = await Job.findOne({ _id: id, createdBy: req.user.userID })
    if (!job) {
        throw new NotFoundError("Couldn't find job with provided id")
    }
    res.status(StatusCodes.OK).json(job)
}

const createJob = async (req, res) => {
    const job = await Job.create({ ...req.body, createdBy: req.user.userID })
    res.status(StatusCodes.CREATED).json(job)
}

const updateJob = async (req, res) => {
    const { id } = req.params
    const { company, status, position } = req.body
    if(company === "" || position === "" || status === "") {
        throw new BadRequestError("Please provide Valid information")
    }
    const job = await Job.findOneAndUpdate({ _id: id, createdBy: req.user.userID }, { company,status,position}, {
        new: true,
        runValidators: true
    })
    if (!job) {
        throw new NotFoundError("Couldn't find job with provided id")
    }
    res.status(StatusCodes.OK).json(job)
}

const deleteJob = async (req, res) => {
    const {id} = req.params
    const job = await Job.findOneAndDelete({_id: id, createdBy: req.user.userID})
    if (!job) {
        throw new NotFoundError("Couldn't find job with provided id")
    }
    res.status(StatusCodes.OK).json({msg: "Successfully deleted"})
}

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob }