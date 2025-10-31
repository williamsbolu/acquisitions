import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import logger from '#config/logger.js';
import { db } from '#config/database.js';
import { users } from '#models/user.model.js';

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (e) {
    logger.error(`Error hashing the password: ${e}`);
    throw new Error('Error hashing the password');
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (e) {
    logger.error(`Error comparing the password: ${e}`);
    throw new Error('Error comparing the password');
  }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) throw new Error('User already exists');

    const passwordHash = await hashPassword(password);

    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: passwordHash,
        role,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        created_at: users.created_at,
      });

    logger.info(`User ${email} created successfully`);
    return newUser;
  } catch (e) {
    logger.error(`Error creating user: ${e}`);
    throw new Error('Error creating user');
  }
};

export const authenticateUser = async ({ email, password }) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length === 0) throw new Error('User not found');

    const userRecord = existingUser[0];

    const isValid = await comparePassword(password, userRecord.password);
    if (!isValid) throw new Error('Invalid password');

    logger.info(`User ${email} authenticated successfully`);

    return {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      role: userRecord.role,
      created_at: userRecord.created_at,
    };
  } catch (e) {
    logger.error(`Error authenticating user: ${e}`);
    throw e;
  }
};

// ? This service are just additional utility functions that we are going to call within our controllers
