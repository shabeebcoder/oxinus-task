import bcrypt from "bcrypt"
const saltRounds = 10; // Number of salt rounds (higher is more secure but slower)

// Function to hash a password
export async function hashPassword(plainPassword: any) {
    try {
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw error;
    }
}

// Function to verify a password
export async function verifyPassword(plainPassword: any, hashedPassword: any) {
    try {
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        return match;
    } catch (error) {
        throw error;
    }
}
