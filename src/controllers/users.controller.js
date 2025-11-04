import logger from '#config/logger.js';
import { fetchAllUsers, getUserById as getUserByIdService, updateUser as updateUserService, deleteUser as deleteUserService } from '#services/users.service.js';
import { userIdSchema, updateUserSchema } from '#validations/users.validation.js';
import { formatValidation } from '#utils/format.js';

export const getAllUsers = async (req, res, next) => {
  try {
    logger.info('Getting users...');

    const users = await fetchAllUsers();

    res.status(200).json({
      message: 'Sucessfully retrived users',
      users,
      count: users.length,
    });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    // Validate request parameters
    const validationResult = userIdSchema.safeParse(req.params);
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        detail: formatValidation(validationResult.error),
      });
    }

    const { id } = validationResult.data;
    
    logger.info(`Getting user by id: ${id}`);

    const user = await getUserByIdService(id);

    res.status(200).json({
      message: 'Successfully retrieved user',
      user,
    });
  } catch (e) {
    logger.error(`Error getting user by id:`, e);
    
    if (e.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    
    next(e);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    // User is available from authentication middleware as req.user
    const currentUser = req.user;
    
    // Validate request parameters
    const paramValidation = userIdSchema.safeParse(req.params);
    if (!paramValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        detail: formatValidation(paramValidation.error),
      });
    }

    const { id } = paramValidation.data;

    // Validate request body
    const bodyValidation = updateUserSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        detail: formatValidation(bodyValidation.error),
      });
    }

    const updates = bodyValidation.data;

    // Authorization checks
    // Users can only update their own information
    if (currentUser.id !== id && currentUser.role !== 'admin') {
      logger.warn(`User ${currentUser.id} tried to update user ${id}`);
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own information',
      });
    }

    // Only admins can change roles
    if (updates.role && currentUser.role !== 'admin') {
      logger.warn(`Non-admin user ${currentUser.id} tried to change role`);
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only administrators can change user roles',
      });
    }

    logger.info(`Updating user ${id}`);

    const updatedUser = await updateUserService(id, updates);

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (e) {
    logger.error(`Error updating user:`, e);
    
    if (e.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    
    next(e);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    // User is available from authentication middleware as req.user
    const currentUser = req.user;
    
    // Validate request parameters
    const validationResult = userIdSchema.safeParse(req.params);
    
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        detail: formatValidation(validationResult.error),
      });
    }

    const { id } = validationResult.data;

    // Authorization check: Users can only delete their own account or admins can delete any account
    if (currentUser.id !== id && currentUser.role !== 'admin') {
      logger.warn(`User ${currentUser.id} tried to delete user ${id}`);
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own account',
      });
    }

    logger.info(`Deleting user ${id}`);

    await deleteUserService(id);

    res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (e) {
    logger.error(`Error deleting user:`, e);
    
    if (e.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    
    next(e);
  }
};

// NOTE: As our app scales, so will all our file contents scale also, so allowing all or our logic to be seperate part and breathe independently is very important for scalability. "Controllers will handle logging, validation and more" and "Services part will only handle the database logic". seperarion of concern which is a must for clean code.
