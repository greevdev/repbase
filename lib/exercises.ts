export type ExerciseCategory =
	| "Chest"
	| "Back"
	| "Shoulders"
	| "Biceps"
	| "Triceps"
	| "Quads"
	| "Hamstrings"
	| "Glutes"
	| "Calves"
	| "Core"
	| "Full Body";

export type ExerciseEquipment =
	| "Barbell"
	| "Dumbbell"
	| "Cable"
	| "Machine"
	| "Smith Machine"
	| "Bodyweight"
	| "EZ Bar"
	| "Trap Bar"
	| "Kettlebell"
	| "Sled"
	| "Other";

export type PredefinedExercise = {
	name: string;
	category: ExerciseCategory;
	equipment: ExerciseEquipment;
};

export const PREDEFINED_EXERCISES: PredefinedExercise[] = [
	// Chest
	{
		name: "Barbell Bench Press",
		category: "Chest",
		equipment: "Barbell",
	},
	{
		name: "Dumbbell Bench Press",
		category: "Chest",
		equipment: "Dumbbell",
	},
	{
		name: "Incline Barbell Bench Press",
		category: "Chest",
		equipment: "Barbell",
	},
	{
		name: "Incline Dumbbell Bench Press",
		category: "Chest",
		equipment: "Dumbbell",
	},
	{
		name: "Machine Chest Press",
		category: "Chest",
		equipment: "Machine",
	},
	{
		name: "Smith Machine Bench Press",
		category: "Chest",
		equipment: "Smith Machine",
	},
	{
		name: "Chest Dip",
		category: "Chest",
		equipment: "Bodyweight",
	},
	{
		name: "Push-Up",
		category: "Chest",
		equipment: "Bodyweight",
	},
	{
		name: "Cable Fly",
		category: "Chest",
		equipment: "Cable",
	},
	{
		name: "Pec Deck",
		category: "Chest",
		equipment: "Machine",
	},

	// Back
	{
		name: "Pull-Up",
		category: "Back",
		equipment: "Bodyweight",
	},
	{
		name: "Chin-Up",
		category: "Back",
		equipment: "Bodyweight",
	},
	{
		name: "Lat Pulldown",
		category: "Back",
		equipment: "Cable",
	},
	{
		name: "Lat Pulldown (Close Grip)",
		category: "Back",
		equipment: "Cable",
	},
	{
		name: "Barbell Row",
		category: "Back",
		equipment: "Barbell",
	},
	{
		name: "Dumbbell Row",
		category: "Back",
		equipment: "Dumbbell",
	},
	{
		name: "Seated Cable Row",
		category: "Back",
		equipment: "Cable",
	},
	{
		name: "Seated Cable Row (Wide Grip)",
		category: "Back",
		equipment: "Cable",
	},
	{
		name: "T-Bar Row",
		category: "Back",
		equipment: "Machine",
	},
	{
		name: "Hammer Strength Row",
		category: "Back",
		equipment: "Machine",
	},

	// Shoulders
	{
		name: "Barbell Overhead Press",
		category: "Shoulders",
		equipment: "Barbell",
	},
	{
		name: "Dumbbell Shoulder Press",
		category: "Shoulders",
		equipment: "Dumbbell",
	},
	{
		name: "Machine Shoulder Press",
		category: "Shoulders",
		equipment: "Machine",
	},
	{
		name: "Smith Machine Shoulder Press",
		category: "Shoulders",
		equipment: "Smith Machine",
	},
	{
		name: "Dumbbell Lateral Raise",
		category: "Shoulders",
		equipment: "Dumbbell",
	},
	{
		name: "Cable Lateral Raise",
		category: "Shoulders",
		equipment: "Cable",
	},
	{
		name: "Reverse Pec Deck",
		category: "Shoulders",
		equipment: "Machine",
	},

	// Biceps
	{
		name: "Barbell Curl",
		category: "Biceps",
		equipment: "Barbell",
	},
	{
		name: "EZ-Bar Curl",
		category: "Biceps",
		equipment: "EZ Bar",
	},
	{
		name: "Dumbbell Curl",
		category: "Biceps",
		equipment: "Dumbbell",
	},
	{
		name: "Hammer Curl",
		category: "Biceps",
		equipment: "Dumbbell",
	},
	{
		name: "Cable Curl",
		category: "Biceps",
		equipment: "Cable",
	},
	{
		name: "Machine Preacher Curl",
		category: "Biceps",
		equipment: "Machine",
	},

	// Triceps
	{
		name: "Cable Triceps Pushdown",
		category: "Triceps",
		equipment: "Cable",
	},
	{
		name: "Rope Triceps Pushdown",
		category: "Triceps",
		equipment: "Cable",
	},
	{
		name: "Dumbbell Overhead Triceps Extension",
		category: "Triceps",
		equipment: "Dumbbell",
	},
	{
		name: "EZ-Bar Skull Crusher",
		category: "Triceps",
		equipment: "EZ Bar",
	},
	{
		name: "Close-Grip Bench Press",
		category: "Triceps",
		equipment: "Barbell",
	},
	{
		name: "Triceps Dip",
		category: "Triceps",
		equipment: "Bodyweight",
	},
	{
		name: "Overhead Triceps Extension",
		category: "Triceps",
		equipment: "Cable",
	},
	{
		name: "Overhead Triceps Rope Extension",
		category: "Triceps",
		equipment: "Cable",
	},

	// Quads
	{
		name: "Back Squat",
		category: "Quads",
		equipment: "Barbell",
	},
	{
		name: "Front Squat",
		category: "Quads",
		equipment: "Barbell",
	},
	{
		name: "Smith Machine Squat",
		category: "Quads",
		equipment: "Smith Machine",
	},
	{
		name: "Hack Squat",
		category: "Quads",
		equipment: "Machine",
	},
	{
		name: "Pendulum Squat",
		category: "Quads",
		equipment: "Machine",
	},
	{
		name: "Leg Press",
		category: "Quads",
		equipment: "Machine",
	},
	{
		name: "Leg Extension",
		category: "Quads",
		equipment: "Machine",
	},
	{
		name: "Bulgarian Split Squat",
		category: "Quads",
		equipment: "Dumbbell",
	},

	// Hamstrings
	{
		name: "Romanian Deadlift",
		category: "Hamstrings",
		equipment: "Barbell",
	},
	{
		name: "Dumbbell Romanian Deadlift",
		category: "Hamstrings",
		equipment: "Dumbbell",
	},
	{
		name: "Lying Leg Curl",
		category: "Hamstrings",
		equipment: "Machine",
	},
	{
		name: "Seated Leg Curl",
		category: "Hamstrings",
		equipment: "Machine",
	},
	{
		name: "Nordic Hamstring Curl",
		category: "Hamstrings",
		equipment: "Bodyweight",
	},

	// Glutes
	{
		name: "Barbell Hip Thrust",
		category: "Glutes",
		equipment: "Barbell",
	},
	{
		name: "Smith Machine Hip Thrust",
		category: "Glutes",
		equipment: "Smith Machine",
	},
	{
		name: "Machine Hip Thrust",
		category: "Glutes",
		equipment: "Machine",
	},
	{
		name: "Cable Glute Kickback",
		category: "Glutes",
		equipment: "Cable",
	},
	{
		name: "Hip Abduction Machine",
		category: "Glutes",
		equipment: "Machine",
	},

	// Calves
	{
		name: "Standing Calf Raise",
		category: "Calves",
		equipment: "Machine",
	},
	{
		name: "Seated Calf Raise",
		category: "Calves",
		equipment: "Machine",
	},
	{
		name: "Leg Press Calf Raise",
		category: "Calves",
		equipment: "Machine",
	},
	{
		name: "Smith Machine Calf Raise",
		category: "Calves",
		equipment: "Smith Machine",
	},

	// Core
	{
		name: "Cable Crunch",
		category: "Core",
		equipment: "Cable",
	},
	{
		name: "Machine Crunch",
		category: "Core",
		equipment: "Machine",
	},
	{
		name: "Hanging Leg Raise",
		category: "Core",
		equipment: "Bodyweight",
	},
	{
		name: "Ab Wheel Rollout",
		category: "Core",
		equipment: "Other",
	},
	{
		name: "Plank",
		category: "Core",
		equipment: "Bodyweight",
	},
	{
		name: "Pallof Press",
		category: "Core",
		equipment: "Cable",
	},

	// Full Body
	{
		name: "Conventional Deadlift",
		category: "Full Body",
		equipment: "Barbell",
	},
	{
		name: "Sumo Deadlift",
		category: "Full Body",
		equipment: "Barbell",
	},
	{
		name: "Trap Bar Deadlift",
		category: "Full Body",
		equipment: "Trap Bar",
	},
	{
		name: "Power Clean",
		category: "Full Body",
		equipment: "Barbell",
	},
	{
		name: "Thruster",
		category: "Full Body",
		equipment: "Barbell",
	},
	{
		name: "Farmer's Carry",
		category: "Full Body",
		equipment: "Dumbbell",
	},
	{
		name: "Sled Push",
		category: "Full Body",
		equipment: "Sled",
	},
];
