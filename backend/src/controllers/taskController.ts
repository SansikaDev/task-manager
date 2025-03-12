import { Request, Response } from "express";
import Task from "../models/Task";
import { AuthRequest } from "../middleware/auth";

// 📌 Create a Task
export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, description, status } = req.body;
  const userId = req.user.id; // Extract user from token

  try {
    const newTask = new Task({
      title,
      description,
      status: status || "pending", // Default status to "pending" if not provided
      user: userId,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// 📌 Get All Tasks for Logged-in User
export const getTasks = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  try {
    const tasks = await Task.find({ user: userId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// 📌 Get Single Task
export const getTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// 📌 Update a Task
export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    // Only allow task owner to update
    if (task.user?.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// 📌 Delete a Task
export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    // Only allow task owner to delete
    if (task.user?.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await task.deleteOne();
    res.status(200).json({ msg: "Task deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
