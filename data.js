const questions = {
    mcq: [
        {
            id: 1,
            question: "What is the time complexity of binary search?",
            options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
            answer: 1,
            category: "Technical"
        },
        {
            id: 2,
            question: "Which data structure uses LIFO principle?",
            options: ["Queue", "Stack", "Tree", "Graph"],
            answer: 1,
            category: "Technical"
        },
        {
            id: 3,
            question: "If A is 20% more than B, by what percent is B less than A?",
            options: ["16.66%", "20%", "25%", "15%"],
            answer: 0,
            category: "Aptitude"
        },
        {
            id: 4,
            question: "Choose the synonym of 'Ephemeral':",
            options: ["Lasting", "Short-lived", "Eternal", "Heavy"],
            answer: 1,
            category: "Verbal"
        },
        {
            id: 5,
            question: "Navigate : Compass :: ?: ?",
            options: ["Drive : Car", "Write : Pen", "Direction : Needle", "Bird : Sky"],
            answer: 2, // Direction : Needle (instrument to find something) - arguably Write:Pen too, but Compass finds Direction. Let's go with Compass guides Navigation.
            // Better analogy: Navigate uses Compass. Write uses Pen.
            // Let's stick to standard logic.
            category: "Reasoning"
        }
    ],
    coding: [
        {
            id: 101,
            title: "Two Sum",
            difficulty: "Easy",
            problem: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            tags: ["Array", "Hash Table"]
        },
        {
            id: 102,
            title: "Reverse Linked List",
            difficulty: "Medium",
            problem: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
            tags: ["Linked List"]
        },
        {
            id: 103,
            title: "Trapping Rain Water",
            difficulty: "Hard",
            problem: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
            tags: ["Two Pointers", "DP"]
        }
    ],
    hr: [
        {
            id: 201,
            question: "Tell me about yourself.",
            tip: "Start with your current role/status, mention key achievements, and explain why you're interested in this specific role. Keep it under 2 minutes."
        },
        {
            id: 202,
            question: "What are your greatest strengths?",
            tip: "Choose strengths relevant to the job (e.g., problem-solving, adaptability). Back them up with specific examples from your projects."
        },
        {
            id: 203,
            question: "Where do you see yourself in 5 years?",
            tip: "Focus on professional growth, mastering skills, and taking on more responsibilities. Align your goals with the company's trajectory."
        }
    ],
    daily: {
        title: "Find the Missing Number",
        desc: "Given an array containing n distinct numbers taken from 0, 1, 2, ..., n, find the one that is missing from the array."
    }
};
