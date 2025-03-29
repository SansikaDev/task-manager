import { Request, Response } from "express";
import Task from "../models/Task";
import { AuthRequest } from "../middleware/auth";
import { log } from "console";

// 📌 Create a Task
export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id; // Extract user from token

    const task = new Task({ user: userId, title, description });
    await task.save();

    res.status(201).json(task);
    log("Task created", task);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

// 📌 Get All Tasks for Logged-in User
export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({ user: userId });

    res.status(200).json(tasks);
    log("Tasks retrieved", tasks);
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
    log("Task retrieved", task);
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
    log("Task updated", updatedTask);
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
    log("Task deleted", task);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
