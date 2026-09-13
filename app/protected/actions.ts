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

    revalidatePath("/protected");

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

    revalidatePath("/protected");

    return { success: true };
}