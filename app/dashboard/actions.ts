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

export async function addWorkout(
    clientId: string,
    formData: FormData
) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const title = formData.get("title")?.toString().trim();
    const notes = formData.get("notes")?.toString().trim();
    const date = formData.get("date")?.toString();

    if (!title || !date) return { success: false, error: "Workout title and date are required" };

    const { error } = await supabase.from("workouts").insert({
        client_id: clientId,
        title,
        notes: notes || null,
        date,
    });

    if (error) return { success: false, error: error.message };

    revalidatePath(`/dashboard/clients/${clientId}`);

    return { success: true };
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

type ExerciseSetInput = {
    reps: string;
    weight: string;
};

export async function addExercise(
    workoutId: string,
    clientId: string,
    formData: FormData,
    sets: ExerciseSetInput[]
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

    const name = formData.get("name")?.toString().trim();
    const notes = formData.get("notes")?.toString().trim();

    if (!name) {
        return {
        success: false,
        error: "Exercise name is required",
        };
    }

    if (sets.length === 0) {
        return {
        success: false,
        error: "Exercise must have at least one set",
        };
    }

    for (const set of sets) {
        const reps = Number(set.reps);

        if (!reps || reps < 1) {
        return {
            success: false,
            error: "Each set must have valid reps",
        };
        }
    }

    const { data: lastExercise } = await supabase
        .from("workout_exercises")
        .select("position")
        .eq("workout_id", workoutId)
        .order("position", { ascending: false })
        .limit(1)
        .maybeSingle();

    const nextPosition = (lastExercise?.position ?? 0) + 1;

    const { data: exercise, error: exerciseError } =
        await supabase
        .from("workout_exercises")
        .insert({
            workout_id: workoutId,
            name,
            notes: notes || null,
            position: nextPosition,
        })
        .select()
        .single();

    if (exerciseError || !exercise) {
        return {
        success: false,
        error:
            exerciseError?.message ??
            "Failed to create exercise",
        };
    }

    const exerciseSets = sets.map((set, index) => ({
        exercise_id: exercise.id,
        set_number: index + 1,
        reps: Number(set.reps),
        weight: set.weight
        ? Number(set.weight)
        : null,
    }));

    const { error: setsError } = await supabase
        .from("exercise_sets")
        .insert(exerciseSets);

    if (setsError) {
        await supabase
        .from("workout_exercises")
        .delete()
        .eq("id", exercise.id);

        return {
        success: false,
        error: setsError.message,
        };
    }

    revalidatePath(
        `/dashboard/clients/${clientId}/workouts/${workoutId}`
    );

    return {
        success: true,
    };
}