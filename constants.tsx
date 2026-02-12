
import React from 'react';
import { Chapter } from './types';

export const APP_NAME = "RoboAcademy";

export const CHAPTERS: Chapter[] = [
  {
    id: "intro-physical-ai",
    module: "Introduction",
    title: "Foundations of Physical AI",
    content: `
      # Foundations of Physical AI
      The future of AI extends beyond digital spaces into the physical world. This capstone quarter introduces Physical AI—AI systems that function in reality and comprehend physical laws.
      
      ## What is Embodied Intelligence?
      Embodied intelligence refers to agents that have a physical form and interact with the environment. Unlike LLMs that process text, Physical AI processes sensorimotor data.
      
      ## Sensor Systems
      - **LiDAR**: Light Detection and Ranging for 3D mapping.
      - **IMUs**: Inertial Measurement Units for balance and orientation.
      - **Depth Cameras**: Providing RGB-D data for spatial awareness.
    `,
    urduSummary: "فیزیکل اے آئی کا تعارف: یہ کورس ان اے آئی سسٹمز پر مبنی ہے جو حقیقی دنیا میں کام کرتے ہیں اور فزکس کے قوانین کو سمجھتے ہیں۔",
    visualData: [
      { name: 'LiDAR', value: 400 },
      { name: 'IMU', value: 300 },
      { name: 'Camera', value: 300 },
      { name: 'Force', value: 200 },
    ]
  },
  {
    id: "ros2-nervous-system",
    module: "Module 1",
    title: "The Robotic Nervous System (ROS 2)",
    content: `
      # ROS 2: The Middleware
      ROS 2 (Robot Operating System) is the industry-standard middleware for building robotic applications.
      
      ## Core Concepts
      - **Nodes**: Independent processing units.
      - **Topics**: Publish/Subscribe communication model.
      - **Services**: Request/Response communication model.
      - **Actions**: Long-running goal-oriented tasks.
      
      ## Why ROS 2?
      It provides hardware abstraction, device drivers, libraries, visualizers, and package management.
    `,
    urduSummary: "ROS 2 روبوٹک اعصابی نظام کی طرح ہے جو مختلف حصوں کے درمیان رابطے کا کام کرتا ہے۔",
    visualData: [
      { name: 'Pub/Sub', value: 500 },
      { name: 'Services', value: 200 },
      { name: 'Actions', value: 150 },
    ]
  },
  {
    id: "digital-twins",
    module: "Module 2",
    title: "The Digital Twin (Gazebo & Unity)",
    content: `
      # Digital Twins & Simulation
      Before deploying to expensive hardware, we use Digital Twins.
      
      ## Gazebo
      A powerful 3D simulation environment for ROS. It handles rigid body dynamics and sensor simulation.
      
      ## Unity
      Used for high-fidelity rendering and human-robot interaction scenarios.
    `,
    urduSummary: "ڈیجیٹل ٹوئنز ہمیں مہنگے ہارڈ ویئر پر جانے سے پہلے سمولیشن میں ٹیسٹ کرنے کی اجازت دیتے ہیں۔"
  },
  {
    id: "isaac-brain",
    module: "Module 3",
    title: "The AI-Robot Brain (NVIDIA Isaac™)",
    content: `
      # NVIDIA Isaac Platform
      NVIDIA Isaac provides hardware-accelerated VSLAM (Visual SLAM) and navigation tools.
      
      ## Isaac Sim
      Photorealistic simulation and synthetic data generation for training reinforcement learning models.
    `,
    urduSummary: "این ویڈیا آئزاک پلیٹ فارم روبوٹ کے دماغ کے طور پر کام کرتا ہے، جو اسے دیکھنے اور سمجھنے کی صلاحیت دیتا ہے۔"
  }
];
