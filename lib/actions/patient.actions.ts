"use server";

import { ID, Query } from "node-appwrite";

import { InputFile } from "node-appwrite/file";

import {
  BUCKET_ID,
  DATABASE_ID,
  ENDPOINT,
  PATIENT_COLLECTION_ID,
  PROJECT_ID,
  databases,
  storage,
  users,
} from "../appwrite.config";
import { parseStringify } from "../utils";

// Helper type guard for property checks
function hasProperty<T extends object, K extends PropertyKey>(
  obj: T,
  prop: K
): obj is T & Record<K, unknown> {
  return obj && typeof obj === "object" && prop in obj;
}

// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    const newuser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    );
    return parseStringify(newuser);
  } catch (error: unknown) {
    // Network or fetch errors
    if (
      typeof error === "object" &&
      error !== null &&
      hasProperty(error, "cause") &&
      typeof (error as { cause: unknown }).cause === "object" &&
      (error as { cause: { code?: string } }).cause &&
      (error as { cause: { code?: string } }).cause.code === "ETIMEDOUT"
    ) {
      console.error("Network error (ETIMEDOUT) in createUser:", error);
      return {
        error: "Network timeout. Please check Appwrite server connectivity.",
      };
    }
    // Appwrite logical errors
    if (
      typeof error === "object" &&
      error !== null &&
      hasProperty(error, "code") &&
      (error as { code?: number }).code === 409
    ) {
      try {
        const existingUser = await users.list([
          Query.equal("email", [user.email]),
        ]);
        if (existingUser.users && existingUser.users.length > 0) {
          return existingUser.users[0];
        } else {
          return {
            error: "User already exists, but could not fetch user details.",
          };
        }
      } catch (fetchError) {
        console.error(
          "Failed to fetch existing user after 409 error:",
          fetchError
        );
        return {
          error:
            "User already exists, but failed to fetch user details due to network error.",
        };
      }
    }
    // Other errors
    console.error("Unhandled error in createUser:", error);
    return { error: "An unexpected error occurred while creating user." };
  }
};

// GET USER
export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
    return null;
  }
};

// REGISTER PATIENT
export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    // Upload file ->  // https://appwrite.io/docs/references/cloud/client-web/storage#createFile
    let file;
    if (identificationDocument) {
      const inputFile =
        identificationDocument &&
        InputFile.fromBuffer(
          identificationDocument?.get("blobFile") as Blob,
          identificationDocument?.get("fileName") as string
        );

      file = await storage.createFile(BUCKET_ID!, ID.unique(), inputFile);
    }

    // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
    const newPatient = await databases.createDocument(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      ID.unique(),
      {
        identificationDocumentId: file?.$id ? file.$id : null,
        identificationDocumentUrl: file?.$id
          ? `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file.$id}/view??project=${PROJECT_ID}`
          : null,
        ...patient,
      }
    );

    return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};

// GET PATIENT
// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    const patients = await databases.listDocuments(
      DATABASE_ID!,
      PATIENT_COLLECTION_ID!,
      [Query.equal("userId", [userId])]
    );

    return parseStringify(patients.documents[0]);
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};
