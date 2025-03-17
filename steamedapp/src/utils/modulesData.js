// Debugging file for student dashboard
export const modulesData = [
    {
      id: "module_1",
      order: 1,
      title: "Basic Python",
      description: "Welcome to Florida Space Institute's educational tool! The first module will be a very basic introduction to Python concepts that will be used in robotics, which will be explored in later modules.",
      isCompleted: false,
      sections: [
        {
          id: "m1_s1",
          title: "Pre-Assesment",
          type: "Multiple Choice Question",
          isCompleted: true
        },
        {
          id: "m1_s2",
          title: "Variables and Data Types",
          type: "multiple-choice",
          isCompleted: true
        },
        {
          id: "m1_s3",
          title: "Control Flow: If Statements",
          type: "fill-blank",
          isCompleted: false
        },
        {
          id: "m1_s4",
          title: "Control Flow: Loops",
          type: "code",
          isCompleted: false
        },
        {
          id: "m1_s5",
          title: "Basic Python Functions",
          type: "code",
          isCompleted: false
        }
      ]
    },
    {
      id: "module_2",
      order: 2,
      title: "Gazebo: UR5 Arm",
      description: "Description goes here.",
      isCompleted: false,
      sections: [
        {
          id: "m2_s1",
          title: "Python Libraries for Robotics",
          type: "text",
          isCompleted: true
        },
        {
          id: "m2_s2",
          title: "Robot Sensor Data Processing",
          type: "multiple-choice",
          isCompleted: true
        },
        {
          id: "m2_s3",
          title: "Robot Movement Control",
          type: "code",
          isCompleted: true
        },
        {
          id: "m2_s4",
          title: "Path Planning Basics",
          type: "code",
          isCompleted: false
        }
      ]
    },
    {
      id: "module_3",
      order: 3,
      title: "Gazebo: LiDAR Sensor",
      description: "Description goes here.",
      isCompleted: false,
      sections: [
        {
          id: "m3_s1",
          title: "Introduction to ROS",
          type: "text",
          isCompleted: false
        },
        {
          id: "m3_s2",
          title: "ROS Nodes and Topics",
          type: "multiple-choice",
          isCompleted: false
        },
        {
          id: "m3_s3",
          title: "Creating ROS Publishers and Subscribers",
          type: "code",
          isCompleted: false
        },
        {
          id: "m3_s4",
          title: "ROS Services and Actions",
          type: "code",
          isCompleted: false
        }
      ]
    },
    {
      id: "module_4",
      order: 3,
      title: "Gazebo: TurtleBot3",
      description: "Description goes here.",
      isCompleted: true,
      sections: [
        {
          id: "m4_s1",
          title: "Gazebo Simulation Environment",
          type: "text",
          isCompleted: true
        },
        {
          id: "m4_s2",
          title: "Robot Sensor Integration",
          type: "multiple-choice",
          isCompleted: true
        },
        {
          id: "m4_s3",
          title: "Autonomous Navigation",
          type: "code",
          isCompleted: true
        },
        {
          id: "m4_s4",
          title: "Final Project: Robot Task Automation",
          type: "code",
          isCompleted: true
        }
      ]
    },
    {
        id: "module_5",
        order: 5,
        title: "Final Project",
        description: "Description goes here.",
        isCompleted: true,
        sections: [
          {
            id: "m4_s1",
            title: "Gazebo Simulation Environment",
            type: "text",
            isCompleted: true
          },
          {
            id: "m4_s2",
            title: "Robot Sensor Integration",
            type: "multiple-choice",
            isCompleted: true
          },
          {
            id: "m4_s3",
            title: "Autonomous Navigation",
            type: "code",
            isCompleted: true
          },
          {
            id: "m4_s4",
            title: "Final Project: Robot Task Automation",
            type: "code",
            isCompleted: true
          }
        ]
      }
  ];