"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addClient(formData: FormData) {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) return {error: Error("Unauthorized."), success: false};

    const name = formData.get("name")?.toString().trim();
    const goal = formData.get("goal")?.toString().trim();
    const yearOfBirthRaw = formData.get("year_of_birth")?.toString();
    const notes = formData.get("notes")?.toString().trim();

    if (!name) return {error: Error("Name is required."), success: false};

    const birthYear = yearOfBirthRaw
    ? Number(yearOfBirthRaw)
    : null;

    const currentYear = new Date().getFullYear();

    if (birthYear !== null && (birthYear < 1900 || birthYear > currentYear)) {
        return {error: Error("Invalid year of birth."), success: false};
    }

    const {error} = await supabase.from("clients").insert({
        user_id: user.id,
        name,
        year_of_birth: birthYear,
        goal: goal || null,
        notes: notes || null,
    });

    if (error) throw new Error(error.message);

    revalidatePath("/dashboard");

    return {success: true};
}

export async function editClient(clientId: string, formData: FormData) {
    const supabase = await createClient();

    const {data: {user}} = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const name = formData.get("name")?.toString().trim();
    const goal = formData.get("goal")?.toString().trim();
    const birthYearRaw = formData.get("year_of_birth")?.toString();
    const notes = formData.get("notes")?.toString().trim();

    const birthYear = birthYearRaw ? Number(birthYearRaw) : null;

    const currentYear = new Date().getFullYear();

    if (
        birthYear !== null &&
        (birthYear < 1900 || birthYear > currentYear)
    ) {
        return {
        success: false,
        error: "Invalid year of birth",
        };
    }

    const { error } = await supabase
        .from("clients")
        .update({
        name,
        goal: goal || null,
        year_of_birth: birthYear,
        notes: notes || null,
        })
        .eq("id", clientId)
        .eq("user_id", user.id);

    if (error) {
        return {
        success: false,
        error: error.message,
        };
    }

    revalidatePath("/dashboard");

    return { success: true };
}

export async function deleteClient(clientId: string) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", clientId)
        .eq("user_id", user.id);

    if (error) {
        return {
        success: false,
        error: error.message,
        };
    }

    revalidatePath("/dashboard");

    return { success: true };
}

type ExerciseInput = {
    name: string;
    notes: string;
    sets: {
        reps: string;
        weight: string;
    }[];
};

export async function addWorkout(
    clientId: string,
    formData: FormData,
    exercises: ExerciseInput[]
) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return {
        success: false,
        error: "Unauthorized",
        };
    }

    const title = formData
        .get("title")
        ?.toString()
        .trim();

    const date = formData
        .get("date")
        ?.toString();

    if (!title || !date) {
        return {
        success: false,
        error: "Title and date are required",
        };
    }

    const { data: workout, error: workoutError } =
        await supabase
        .from("workouts")
        .insert({
            client_id: clientId,
            title,
            date,
        })
        .select()
        .single();

    if (workoutError || !workout) {
        return {
        success: false,
        error:
            workoutError?.message ??
            "Failed to create workout",
        };
    }

    for (
        let exerciseIndex = 0;
        exerciseIndex < exercises.length;
        exerciseIndex++
    ) {
        const exerciseInput =
        exercises[exerciseIndex];

        const { data: exercise, error: exerciseError } =
        await supabase
            .from("workout_exercises")
            .insert({
            workout_id: workout.id,
            name: exerciseInput.name,
            notes: exerciseInput.notes || null,
            position: exerciseIndex + 1,
            })
            .select()
            .single();

        if (exerciseError || !exercise) {
        await supabase
            .from("workouts")
            .delete()
            .eq("id", workout.id);

        return {
            success: false,
            error:
            exerciseError?.message ??
            "Failed to create exercise",
        };
        }

        const sets = exerciseInput.sets.map(
        (set, index) => ({
            exercise_id: exercise.id,
            set_number: index + 1,
            reps: Number(set.reps),
            weight: set.weight
            ? Number(set.weight)
            : null,
        })
        );

        if (sets.length > 0) {
        const { error: setsError } =
            await supabase
            .from("exercise_sets")
            .insert(sets);

        if (setsError) {
            await supabase
            .from("workouts")
            .delete()
            .eq("id", workout.id);

            return {
            success: false,
            error: setsError.message,
            };
        }
    }
  }

  revalidatePath(
    `/dashboard/clients/${clientId}`
  );

  return {
    success: true,
  };
}

export async function editWorkout(workoutId: string, clientId: string, formData: FormData) {
    const supabase = await createClient();

    const {data: {user}} = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const title = formData.get("title")?.toString().trim();
    const date = formData.get("date")?.toString();
    const notes = formData.get("notes")?.toString().trim();

    if (!title || !date) return {success: false, error: "Title and date are required"};

    const { error } = await supabase
        .from("workouts")
        .update({
            title,
            date,
            notes: notes || null,
        })
        .eq("id", workoutId);

    if (error) return { success: false, error: error.message };

    revalidatePath(`/dashboard/clients/${clientId}`);

    return { success: true };
}

export async function deleteWorkout(workoutId: string, clientId: string) {
    const supabase = await createClient();

    const {data: {user}} = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const { error } = await supabase
        .from("workouts")
        .delete()
        .eq("id", workoutId);

    if (error) return { success: false, error: error.message };

    revalidatePath(`/dashboard/clients/${clientId}`);

    return { success: true };
}