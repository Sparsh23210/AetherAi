import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';

// @desc    Save user preferences
// @route   POST /api/user/preferences
// @access  Private
export const saveUserPreferences = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { categories, budget, skill, apiNeeded } = req.body;
  const userId = req.user.uid;

  // We map Firebase UID to the user_profiles table if needed, 
  // but the current schema uses UUID for user_profiles.id (referencing auth.users).
  // This is a discrepancy between Firebase and Supabase.
  // For now, we will use the Firebase UID directly if the DB allows or create a mapping.
  
  // NOTE: In a real production app, we would have a 'users' table that maps Firebase UID to a local ID.
  // For this project, I will assume we are using the Firebase UID as the primary key for our user-related tables.

  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      preferred_category: categories?.join(','),
      budget_preference: budget,
      skill_level: skill,
      api_needed: apiNeeded
    })
    .select();

  if (error) throw error;
  res.status(200).json({ success: true, data });
});
